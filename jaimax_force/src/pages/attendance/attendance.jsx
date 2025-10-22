import React, { useEffect, useState } from "react";
import {
  CalendarDays,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  BarChart3,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  useCheckInMutation,
  useCheckOutMutation,
  useGetUserAttendanceQuery,
  useGetMonthlyAttendanceStatsQuery,
} from "../../features/attendance/attendanceApiSlice";
import { useSelector } from "react-redux";

// --- Debounce hook ---
const useDebounce = (value, delay = 600) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
};

// --- Helper: Get start and end dates for current month ---
const getMonthDateRange = (date = new Date()) => {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return {
    startDate: start.toISOString().split("T")[0],
    endDate: end.toISOString().split("T")[0],
  };
};

export default function Attendance() {
  const { user } = useSelector((state) => state.auth);
  const userId = user?.id;

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    status: "",
  });
  const [page, setPage] = useState(1);
  const limit = 10;
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

  const debouncedStart = useDebounce(filters.startDate);
  const debouncedEnd = useDebounce(filters.endDate);
  const debouncedStatus = useDebounce(filters.status);

  const { startDate: monthStart, endDate: monthEnd } = getMonthDateRange();
  const activeStartDate = debouncedStart || monthStart;
  const activeEndDate = debouncedEnd || monthEnd;

  // --- Fetch Attendance List ---
  const {
    data: attendanceData,
    isLoading,
    isError,
    refetch,
  } = useGetUserAttendanceQuery(
    {
      userId,
      status: debouncedStatus || undefined,
      startDate: activeStartDate,
      endDate: activeEndDate,
      page,
      limit,
    },
    { skip: !userId }
  );

  // --- Fetch Monthly Stats ---
  const now = new Date();
  const { data: statsData, isLoading: statsLoading } =
    useGetMonthlyAttendanceStatsQuery({
      userId,
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    });

  const stats = statsData?.data?.stats || {};
  const attendanceHistory = attendanceData?.data?.records || [];
  const pagination = attendanceData?.data?.pagination || {};
  const totalPages = pagination?.totalPages || 1;

  // --- Check-in/out mutations ---
  const [checkIn, { isLoading: checkingIn }] = useCheckInMutation();
  const [checkOut, { isLoading: checkingOut }] = useCheckOutMutation();
  const [manualCheckIn, setManualCheckIn] = useState(false);
  const [manualCheckOut, setManualCheckOut] = useState(false);

  const getLocation = () =>
    new Promise((resolve, reject) => {
      if (!navigator.geolocation)
        reject(new Error("Geolocation not supported by your browser."));
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          }),
        () => reject(new Error("Please allow location access to mark attendance.")),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });

  const handleCheckIn = async () => {
    try {
      setManualCheckIn(true);
      const { latitude, longitude } = await getLocation();
      const res = await checkIn({ latitude, longitude }).unwrap();
      if (res.success) {
        toast.success(res.message || "Checked in successfully");
        await refetch();
      } else toast.error(res.message || "Something went wrong");
    } catch (err) {
      toast.error(err?.data?.message || err.message || "Something went wrong");
    } finally {
      setManualCheckIn(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setManualCheckOut(true);
      const { latitude, longitude } = await getLocation();
      const res = await checkOut({ latitude, longitude }).unwrap();
      if (res.success) {
        toast.success(res.message || "Checked out successfully");
        await refetch();
      } else toast.error(res.message || "Something went wrong");
    } catch (err) {
      toast.error(err?.data?.message || err.message || "Something went wrong");
    } finally {
      setManualCheckOut(false);
    }
  };

  const deriveStatus = (record) => {
    if (record?.status)
      return record.status.charAt(0).toUpperCase() + record.status.slice(1);
    const hrs = record?.workHours || 0;
    if (hrs >= 8) return "Present";
    if (hrs >= 4) return "Half Day";
    return "Absent";
  };

  const formatWorkHours = (hours, isCheckedOut) => {
    if (!isCheckedOut) return "-";
    if (!hours || hours <= 0) return "0 hrs 0 mins";
    const totalMinutes = Math.round(hours * 60);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    if (h === 0) return `${m} mins`;
    if (m === 0) return `${h} hr${h > 1 ? "s" : ""}`;
    return `${h} hr${h > 1 ? "s" : ""} ${m} min${m !== 1 ? "s" : ""}`;
  };

const today = new Date().toISOString().split("T")[0];

const todayRecord = attendanceHistory.find((rec) => {
  const recordDate = new Date(rec.date).toISOString().split("T")[0];
  return recordDate === today;
});

const isCheckedIn = Boolean(todayRecord?.checkIn?.time);
const isCheckedOut = Boolean(todayRecord?.checkOut?.time);


  const handlePrevPage = () => {
    if (page > 1) setPage((p) => p - 1);
  };
  const handleNextPage = () => {
    if (page < totalPages) setPage((p) => p + 1);
  };

  useEffect(() => {
    refetch();
  }, [page, debouncedStart, debouncedEnd, debouncedStatus]);

  // --- Month auto refresh ---
  useEffect(() => {
    const watcher = setInterval(() => {
      const now = new Date();
      if (now.getMonth() !== currentMonth) {
        setCurrentMonth(now.getMonth());
        toast.info("Month changed — refreshing attendance data...", {
          theme: "dark",
        });
        refetch();
      }
    }, 1000 * 60 * 5);
    return () => clearInterval(watcher);
  }, [currentMonth, refetch]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(1);
  };

  return (
    <div className="flex flex-col flex-1 w-full h-full overflow-y-auto bg-[#0f0f0f] text-white p-3 sm:p-4 md:p-6 font-sans">
      <ToastContainer />

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <CalendarDays size={24} className="text-[#FFD700]" />
        <h1 className="text-xl sm:text-2xl font-bold">Attendance</h1>
      </div>

      {/* --- Monthly Stats Cards --- */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
        {statsLoading ? (
          <div className="text-gray-400 text-center col-span-full">
            Loading monthly stats...
          </div>
        ) : (
          <>
            <div className="p-3 sm:p-4 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] flex flex-col items-center justify-center">
              <BarChart3 size={20} className="text-[#FFD700] mb-1" />
              <p className="text-xs text-gray-400">Total Days</p>
              <p className="text-lg font-semibold text-[#FFD700]">
                {stats.totalDays ?? "-"}
              </p>
            </div>
            <div className="p-3 sm:p-4 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] flex flex-col items-center justify-center">
              <BarChart3 size={20} className="text-green-400 mb-1" />
              <p className="text-xs text-gray-400">Working Days</p>
              <p className="text-lg font-semibold text-green-400">
                {stats.workingDays ?? "-"}
              </p>
            </div>
            <div className="p-3 sm:p-4 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] flex flex-col items-center justify-center">
              <BarChart3 size={20} className="text-blue-400 mb-1" />
              <p className="text-xs text-gray-400">Present</p>
              <p className="text-lg font-semibold text-blue-400">
                {stats.presentDays ?? "-"}
              </p>
            </div>
            <div className="p-3 sm:p-4 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] flex flex-col items-center justify-center">
              <BarChart3 size={20} className="text-red-400 mb-1" />
              <p className="text-xs text-gray-400">Absent</p>
              <p className="text-lg font-semibold text-red-400">
                {stats.absentDays ?? "-"}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-6 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-3">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            className="w-full bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-white focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] outline-none transition-all"
              style={{ colorScheme: 'dark' }}
                        />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">End Date</label>
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            className="w-full bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-white focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] outline-none transition-all"
              style={{ colorScheme: 'dark' }}
                        />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Status</label>
          <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-white focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] outline-none transition-all appearance-none cursor-pointer"
              style={{ 
                colorScheme: 'dark',
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23FFD700' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.75rem center',
                backgroundSize: '12px',
                paddingRight: '2.5rem'
              }}
            >
              <option value="" className="bg-[#1a1a1a] text-white">All Status</option>
              <option value="present" className="bg-transparent text-white hover:bg-[#FFD700]">Present</option>
              <option value="absent" className="bg-[#1a1a1a] text-white hover:bg-[#FFD700]">Absent</option>
              <option value="halfday" className="bg-[#1a1a1a] text-white hover:bg-[#FFD700]">Half Day</option>
            </select>
        </div>
      </div>

      {/* Check-In / Check-Out */}
      <div className="flex flex-wrap gap-3 justify-end mb-4">
        <button
          onClick={handleCheckIn}
          disabled={checkingIn || manualCheckIn || isCheckedIn}
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md font-semibold text-black transition w-full sm:w-auto ${
            isCheckedIn
              ? "bg-green-400 cursor-not-allowed"
              : "bg-[#18a04a] hover:opacity-90"
          }`}
        >
          <Check size={16} />
          {manualCheckIn
            ? "Checking In..."
            : isCheckedIn
            ? "Checked In"
            : "Check-In"}
        </button>

        <button
          onClick={handleCheckOut}
          disabled={!isCheckedIn || checkingOut || manualCheckOut || isCheckedOut}
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md font-semibold text-black transition w-full sm:w-auto ${
            isCheckedOut
              ? "bg-yellow-200 cursor-not-allowed"
              : "bg-[#FFD700] hover:opacity-90"
          }`}
        >
          <X size={16} />
          {manualCheckOut
            ? "Checking Out..."
            : isCheckedOut
            ? "Checked Out"
            : "Check-Out"}
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-[#2a2a2a] bg-[#1a1a1a]">
        <table className="w-full text-xs sm:text-sm">
          <thead className="bg-[#222] text-[#FFD700] text-left">
            <tr>
              <th className="p-3">Date</th>
              <th className="p-3">Check-In</th>
              <th className="p-3">Check-Out</th>
              <th className="p-3">Work Hours</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-400">
                  Loading records...
                </td>
              </tr>
            ) : isError || attendanceHistory.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-400 italic">
                  No records yet
                </td>
              </tr>
            ) : (
              attendanceHistory.map((item, i) => {
                const dateDisplay = new Date(item.date).toLocaleDateString(
                  "en-IN",
                  { day: "2-digit", month: "short", year: "numeric" }
                );
                const inTime = item?.checkIn?.time
                  ? new Date(item.checkIn.time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "-";
                const outTime = item?.checkOut?.time
                  ? new Date(item.checkOut.time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "-";
                const hours = formatWorkHours(item?.workHours, !!item?.checkOut?.time);
                const status = !!item?.checkOut?.time ? deriveStatus(item) : "-";

                return (
                  <tr
                    key={i}
                    className="border-b border-[#2a2a2a] hover:bg-[#2a2a2a]/40 transition"
                  >
                    <td className="p-3">{dateDisplay}</td>
                    <td className="p-3">{inTime}</td>
                    <td className="p-3">{outTime}</td>
                    <td className="p-3">{hours}</td>
                    <td
                      className={`p-3 font-semibold ${
                        status === "Present"
                          ? "text-green-400"
                          : status === "Half Day"
                          ? "text-yellow-400"
                          : "text-red-400"
                      }`}
                    >
                      {status}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end gap-4 mt-4">
        <button
          onClick={handlePrevPage}
          disabled={page === 1}
          className={`flex items-center gap-2 px-3 py-1 border border-[#FFD700]/40 rounded-md text-sm ${
            page === 1
              ? "text-gray-500 border-gray-700 cursor-not-allowed"
              : "text-[#FFD700] hover:bg-[#FFD700]/10"
          }`}
        >
          <ChevronLeft size={16} /> Prev
        </button>
        <span className="text-sm text-gray-400">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={page >= totalPages}
          className={`flex items-center gap-2 px-3 py-1 border border-[#FFD700]/40 rounded-md text-sm ${
            page >= totalPages
              ? "text-gray-500 border-gray-700 cursor-not-allowed"
              : "text-[#FFD700] hover:bg-[#FFD700]/10"
          }`}
        >
          Next <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
