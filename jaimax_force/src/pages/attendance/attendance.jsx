import {
  BarChart3,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import {
  useCheckInMutation,
  useCheckOutMutation,
  useGetUserAttendanceQuery,
} from "../../features/attendance/attendanceApiSlice";
import { toast } from "../../features/helpers/Toaster";

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
  // const now = new Date();
  // const { data: statsData, isLoading: statsLoading } =
  //   useGetMonthlyAttendanceStatsQuery({
  //     userId,
  //     month: now.getMonth() + 1,
  //     year: now.getFullYear(),
  //   });

  const attandanceStats = useSelector((state) => state.attendance);

  // console.log("attendance", attandanceStats)

  const statsLoading = !attandanceStats;

  const stats = attandanceStats?.data?.stats || {};
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
        () =>
          reject(new Error("Please allow location access to mark attendance.")),
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
    <div className="flex flex-col flex-1 w-full overflow-y-auto bg-[#0b0b0b] text-white p-4 sm:p-6 font-sans">
      {/* <ToastContainer /> */}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <CalendarDays size={26} className="text-[#FFD700]" />
          <h1 className="text-2xl font-bold">Attendance</h1>
        </div>

        {/* Check-In / Check-Out Buttons */}
        <div className="flex flex-row gap-3 w-full sm:w-auto">
  {/* CHECK-IN BUTTON */}
  <button
    onClick={handleCheckIn}
    disabled={checkingIn || manualCheckIn || isCheckedIn}
    className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-semibold text-black transition disabled:opacity-60 ${
      isCheckedIn
        ? "bg-green-500 cursor-not-allowed"
        : "bg-[#14ea62] hover:bg-[#18b14b]"
    }`}
  >
    <Check size={16} />
    {/* Responsive text */}
    <span className="hidden lg:inline">
      {manualCheckIn
        ? "Checking In..."
        : isCheckedIn
        ? "Checked In"
        : "Check-In"}
    </span>
    <span className="lg:hidden">
      {manualCheckIn
        ? "..."
        : isCheckedIn
        ? "In"
        : "In"}
    </span>
  </button>

  {/* CHECK-OUT BUTTON */}
  <button
    onClick={handleCheckOut}
    disabled={
      !isCheckedIn || checkingOut || manualCheckOut || isCheckedOut
    }
    className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-semibold text-black transition disabled:opacity-60 ${
      isCheckedOut
        ? "bg-yellow-400 cursor-not-allowed"
        : "bg-[#FFD700] hover:bg-[#e6c200]"
    }`}
  >
    <X size={16} />
    {/* Responsive text */}
    <span className="hidden lg:inline">
      {manualCheckOut
        ? "Checking Out..."
        : isCheckedOut
        ? "Checked Out"
        : "Check-Out"}
    </span>
    <span className="lg:hidden">
      {manualCheckOut
        ? "..."
        : isCheckedOut
        ? "Out"
        : "Out"}
    </span>
  </button>
</div>

      </div>

      {/* Monthly Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statsLoading ? (
          <div className="col-span-full text-gray-400 text-center">
            Loading monthly stats...
          </div>
        ) : (
          <>
            <div className="p-4 rounded-xl bg-[#141414] border border-[#2a2a2a] flex flex-col items-center justify-center shadow-sm hover:shadow-md transition">
              <BarChart3 size={22} className="text-[#FFD700] mb-1" />
              <p className="text-xs text-gray-400">Total Days</p>
              <p className="text-lg font-semibold text-[#FFD700]">
                {stats.totalDays ?? "-"}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#141414] border border-[#2a2a2a] flex flex-col items-center justify-center shadow-sm hover:shadow-md transition">
              <BarChart3 size={22} className="text-green-400 mb-1" />
              <p className="text-xs text-gray-400">Working Days</p>
              <p className="text-lg font-semibold text-green-400">
                {stats.workingDays ?? "-"}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#141414] border border-[#2a2a2a] flex flex-col items-center justify-center shadow-sm hover:shadow-md transition">
              <BarChart3 size={22} className="text-blue-400 mb-1" />
              <p className="text-xs text-gray-400">Present</p>
              <p className="text-lg font-semibold text-blue-400">
                {stats.presentDays ?? "-"}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#141414] border border-[#2a2a2a] flex flex-col items-center justify-center shadow-sm hover:shadow-md transition">
              <BarChart3 size={22} className="text-red-400 mb-1" />
              <p className="text-xs text-gray-400">Absent</p>
              <p className="text-lg font-semibold text-red-400">
                {stats.absentDays ?? "-"}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-8 bg-[#141414] border border-[#2a2a2a] rounded-xl p-4">
        {/* Start Date */}
        <div>
          <label className="block text-xs text-gray-400 mb-1">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            className="w-full bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-white focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] outline-none"
            style={{ colorScheme: "dark" }}
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-xs text-gray-400 mb-1">End Date</label>
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            className="w-full bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-white focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] outline-none"
            style={{ colorScheme: "dark" }}
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs text-gray-400 mb-1">Status</label>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="w-full bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-white focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] outline-none appearance-none"
            style={{
              colorScheme: "dark",
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23FFD700' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 0.75rem center",
              backgroundSize: "12px",
              paddingRight: "2.5rem",
            }}
          >
            <option value="">All Status</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="halfday">Half Day</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-[#3d3d3d] bg-[#1a1a1a] shadow-sm">
        <table className="w-full text-xs sm:text-sm">
          <thead className="bg-[#FFD700] text-black border-b-2 border-[#222]">
            <tr>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Check-In</th>
              <th className="p-3 text-left">Check-Out</th>
              <th className="p-3 text-left">Work Hours</th>
              <th className="p-3 text-left">Status</th>
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
                <td
                  colSpan="5"
                  className="text-center py-6 text-gray-400 italic"
                >
                  No records found
                </td>
              </tr>
            ) : (
              attendanceHistory.map((item, i) => {
                const dateDisplay = new Date(item.date).toLocaleDateString(
                  "en-IN",
                  {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }
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
                const hours = formatWorkHours(
                  item?.workHours,
                  !!item?.checkOut?.time
                );
                const status = !!item?.checkOut?.time
                  ? deriveStatus(item)
                  : "-";

                return (
                  <tr
                    key={i}
                    className="border-b border-[#2a2a2a] hover:bg-[#222]/60 transition"
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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-5">
        <span className="text-sm text-gray-400">
          Page {page} of {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            onClick={handlePrevPage}
            disabled={page === 1}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm ${
              page === 1
                ? "text-gray-500 border-gray-700 cursor-not-allowed"
                : "text-[#FFD700] border-[#FFD700]/40 hover:bg-[#FFD700]/10"
            }`}
          >
            <ChevronLeft size={14} /> Prev
          </button>
          <button
            onClick={handleNextPage}
            disabled={page >= totalPages}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm ${
              page >= totalPages
                ? "text-gray-500 border-gray-700 cursor-not-allowed"
                : "text-[#FFD700] border-[#FFD700]/40 hover:bg-[#FFD700]/10"
            }`}
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
