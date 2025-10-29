import { AlertTriangle, CalendarDays, Edit, Eye, Filter, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useGetAllAttendanceQuery } from "../../features/attendance/attendanceApiSlice";
import UpdateAttendanceModal from "./UpdateAttendanceModal";

// Simple debounce hook
function useDebounce(value, delay = 600) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export default function AllEmployeeAttendance() {
  // --- Filter states ---
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    employeeId: "",
    status: "",
    sortBy: "date",
    sortOrder: "desc",
  });

  // Debounced values for date filters
  const debouncedStart = useDebounce(filters.startDate);
  const debouncedEnd = useDebounce(filters.endDate);

  // --- Query call ---
  const { data, isLoading, isError, refetch } = useGetAllAttendanceQuery({
    startDate: debouncedStart || undefined,
    endDate: debouncedEnd || undefined,
    employeeId: filters.employeeId || undefined,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
    status: filters.status || undefined,
  });

  const records = data?.data?.records || [];

  const [selectedRecord, setSelectedRecord] = useState(null);

  // --- Helper: work hours formatting ---
  const formatWorkHours = (hours) => {
    if (!hours || hours <= 0) return "-";
    const totalMinutes = Math.round(hours * 60);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    if (h === 0) return `${m} mins`;
    if (m === 0) return `${h} hr${h > 1 ? "s" : ""}`;
    return `${h} hr${h > 1 ? "s" : ""} ${m} min${m !== 1 ? "s" : ""}`;
  };

  // --- Handlers ---
  const handleInputChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleViewEmployee = (empId) => {
    setFilters((prev) => ({
      ...prev,
      employeeId: empId,
    }));
    toast.info(`Viewing attendance for ${empId}`, { theme: "dark" });
  };

  const handleBackToAll = () => {
    setFilters((prev) => ({
      ...prev,
      employeeId: "",
    }));
    toast.info("Showing all employees", { theme: "dark" });
  };

  const handleUpdateEmployee = (record) =>{
    setSelectedRecord(record);
  }

  const handleRefresh = useCallback(() => {
    refetch();
    toast.success("Attendance data refreshed", { theme: "dark" });
  }, [refetch]);

  return (
    <div className="flex flex-col flex-1 bg-[#0f0f0f] text-white p-4 sm:p-4 md:p-4 mb-10 lg:mb-0 ">
      <ToastContainer />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-2 bg-[#FFD700]/10 rounded-lg">
            <CalendarDays size={24} className="text-[#FFD700]" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-[#FFD700]">
              {filters.employeeId
                ? `Employee Attendance`
                : "All Employees Attendance"}
            </h1>
            {filters.employeeId && (
              <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
                ID: {filters.employeeId}
              </p>
            )}
          </div>
        </div>
         </div>

        <div className="flex gap-2 justify-end">
          {filters.employeeId && (
            <button
              onClick={handleBackToAll}
              className="px-3 sm:px-4 py-2 bg-[#2a2a2a] text-white text-sm rounded-lg hover:bg-[#3a3a3a] transition-all duration-200 border border-[#3a3a3a]"
            >
              ← Back to All
            </button>
          )}
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#FFD700] text-black text-sm rounded-lg font-semibold hover:bg-[#e0c300] transition-all duration-200 shadow-lg shadow-[#FFD700]/20"
          >
            <RefreshCw size={16} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
     

      {/* Filters */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center gap-2 mb-3">
          {/* <Filter size={18} className="text-[#FFD700]" /> */}
          <h2 className="text-sm font-semibold text-gray-300 p-1">Filters & Sorting</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 bg-[#1a1a1a] border border-[#3d3d3d] rounded-xl p-3 sm:p-4">
          <div className="flex flex-col">
            <label className="block text-xs font-medium text-gray-400 mb-1.5">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleInputChange}
              className="w-full bg-[#0f0f0f] border border-[#3d3d3d] rounded-lg px-3 py-2.5 text-sm text-white focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] outline-none transition-all"
              style={{ colorScheme: 'dark' }}
            />
          </div>

          <div className="flex flex-col">
            <label className="block text-xs font-medium text-gray-400 mb-1.5">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleInputChange}
              className="w-full bg-[#0f0f0f] border border-[#3d3d3d] rounded-lg px-3 py-2.5 text-sm text-white focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] outline-none transition-all"
              style={{ colorScheme: 'dark' }}
            />
          </div>

          <div className="flex flex-col">
            <label className="block text-xs font-medium text-gray-400 mb-1.5">
              Attendance Status
            </label>
            <select
    name="status"
    value={filters.status}
    onChange={handleInputChange}
    className="w-full bg-[#0f0f0f] border border-[#3d3d3d] rounded-lg px-3 py-2.5 text-sm text-white 
               focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] outline-none transition-all appearance-none cursor-pointer"
    // style={{
    //   backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23FFD700' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
    //   backgroundRepeat: 'no-repeat',
    //   backgroundPosition: 'right 0.75rem center',
    //   backgroundSize: '12px',
    //   paddingRight: '2.5rem',
    // }}
  >
    <option value="">All Status</option>
    <option value="present">Present</option>
    <option value="absent">Absent</option>
    <option value="halfday">Half Day</option>
  </select>
          </div>

          <div className="flex flex-col">
            <label className="block text-xs font-medium text-gray-400 mb-1.5">
              Sort Order
            </label>
            <select
              name="sortOrder"
              value={filters.sortOrder}
              onChange={handleInputChange}
              className="w-full bg-[#0f0f0f] border border-[#3d3d3d] rounded-lg px-3 py-2.5 text-sm text-white focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] outline-none transition-all appearance-none cursor-pointer"
              // style={{ 
              //   colorScheme: 'dark',
              //   backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23FFD700' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
              //   backgroundRepeat: 'no-repeat',
              //   backgroundPosition: 'right 0.75rem center',
              //   backgroundSize: '12px',
              //   paddingRight: '2.5rem'
              // }}
            >
              <option value="asc" className="bg-[#1a1a1a] text-white hover:bg-[#FFD700]/20">Oldest First</option>
              <option value="desc" className="bg-[#1a1a1a] text-white hover:bg-[#FFD700]/20">Newest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-[#3d3d3d] rounded-xl bg-[#1a1a1a] shadow-xl">
        <table className="w-full text-sm text-left min-w-[800px]">
          <thead className="bg-[#FFD700] text-black border-b-2 border-[#222]">
            <tr>
              <th className="p-3 sm:p-4 font-semibold whitespace-nowrap min-w-[120px]">Employee ID</th>
              <th className="p-3 sm:p-4 font-semibold whitespace-nowrap min-w-[120px]">Date</th>
              <th className="p-3 sm:p-4 font-semibold whitespace-nowrap min-w-[120px]">Status</th>
              <th className="p-3 sm:p-4 font-semibold whitespace-nowrap min-w-[120px]">Check-In</th>
              <th className="p-3 sm:p-4 font-semibold whitespace-nowrap min-w-[120px]">Check-Out</th>
              <th className="p-3 sm:p-4 font-semibold whitespace-nowrap min-w-[120px]">Work Hours</th>
              <th className="p-3 sm:p-4 text-center font-semibold whitespace-nowrap min-w-[120px]">Action</th>
              <th className="p-3 sm:p-4 text-center font-semibold whitespace-nowrap min-w-[120px]">Update</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="7" className="text-center py-12 text-gray-400">
                  <div className="flex flex-col items-center gap-3">
                    <RefreshCw size={24} className="animate-spin text-[#FFD700]" />
                    <span>Loading records...</span>
                  </div>
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-12 text-red-400"
                >
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-2xl"><AlertTriangle size={30}/> </span>
                    <span>Failed to fetch records</span>
                  </div>
                </td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-12 text-gray-400"
                >
                  <div className="flex flex-col items-center gap-2">
                    <CalendarDays size={32} className="text-gray-500" />
                    <span>No attendance records found</span>
                    <span className="text-xs text-gray-400">Try adjusting your filters</span>
                  </div>
                </td>
              </tr>
            ) : (
              records.map((item, i) => {
                const dateDisplay = new Date(item.date).toLocaleDateString(
                  "en-IN",
                  { day: "2-digit", month: "short", year: "numeric" }
                );
                const checkIn = item?.checkIn?.time
                  ? new Date(item.checkIn.time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "-";
                const checkOut = item?.checkOut?.time
                  ? new Date(item.checkOut.time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "-";
                const workHours = formatWorkHours(item.workHours);
                const status =
                  item.status?.charAt(0).toUpperCase() + item.status?.slice(1);

                return (
                  <tr
                    key={i}
                    className="border-b border-[#2a2a2a] hover:bg-[#2a2a2a]/60 transition-colors duration-150"
                  >
                    <td className="p-3 sm:p-4 font-medium text-gray-200">{item.userId?.employeeId}</td>
                    <td className="p-3 sm:p-4 text-gray-300">{dateDisplay}</td>
                    <td className="p-3 sm:p-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          item.status === "present"
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : item.status === "absent"
                            ? "bg-red-500/20 text-red-400 border border-red-500/30"
                            : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                        }`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="p-3 sm:p-4 text-gray-300 ">{checkIn}</td>
                    <td className="p-3 sm:p-4 text-gray-300 ">{checkOut}</td>
                    <td className="p-3 sm:p-4 text-gray-200 ">{workHours}</td>
                    <td className="p-3 sm:p-4 text-center">
                      <button
                        onClick={() =>
                          handleViewEmployee(item.userId?.employeeId)
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FFD700]/15 text-[#FFD700] rounded-lg hover:bg-[#FFD700] hover:text-black transition-all duration-200 text-xs font-semibold border border-[#FFD700]/30"
                      >
                        <Eye size={14} /> View
                      </button>
                    </td>

                    {/*update*/}
                    <td className="p-3 sm:p-4 text-center">
                      <button
                        onClick={() =>
                          handleUpdateEmployee(item)
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FFD700]/15 text-[#FFD700] rounded-lg hover:bg-[#FFD700] hover:text-black transition-all duration-200 text-xs font-semibold border border-[#FFD700]/30"
                      >
                        <Edit size={14} /> Update
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Results count */}
      {!isLoading && !isError && records.length > 0 && (
        <div className="mt-4 text-end text-sm text-gray-400">
          Showing <span className="text-[#FFD700] font-semibold">{records.length}</span> record{records.length !== 1 ? 's' : ''}
        </div>
      )}


      {selectedRecord && (
        <UpdateAttendanceModal
         isOpen = {!!selectedRecord}
         onClose = {() =>(setSelectedRecord(null), refetch())}
         record = {selectedRecord}
         />
      )}
    </div>
  );
}