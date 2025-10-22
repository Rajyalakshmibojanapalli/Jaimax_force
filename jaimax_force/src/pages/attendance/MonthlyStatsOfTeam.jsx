import { useState } from "react";
import { CalendarDays, Eye, RefreshCw, X } from "lucide-react";
import { useGetAllUsersMonthlyAttendanceQuery } from "../../features/attendance/attendanceApiSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function MonthlyStatsOfTeam() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);

  // --- Fetch monthly stats ---
  const {
    data: statsData,
    isLoading,
    isError,
    refetch,
  } = useGetAllUsersMonthlyAttendanceQuery({
    userId: selectedUserId || "all", // fixed for HR — all users
    month,
    year,
  });

  const handleRefresh = () => {
    refetch();
    toast.success("Monthly stats refreshed", { theme: "dark" });
  };

  const handleMonthChange = (e) => setMonth(Number(e.target.value));
  const handleYearChange = (e) => setYear(Number(e.target.value));

  const stats = statsData?.data?.stats || [];
  const totalWorkingDays = statsData?.data?.totalWorkingDays || 0;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-4 sm:p-6 md:p-8">
      <ToastContainer />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-2 bg-[#FFD700]/10 rounded-lg">
            <CalendarDays size={24} className="text-[#FFD700]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">
              Monthly Stats of Team
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
              {new Date(year, month - 1).toLocaleString("en-IN", { month: "long" })} {year} 
            </p>
          </div>
        </div>

        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-[#FFD700] text-black text-sm rounded-lg font-semibold hover:bg-[#e0c300] transition-all duration-200 shadow-lg shadow-[#FFD700]/20"
        >
          <RefreshCw size={16} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Month & Year Selectors */}
      <div className="flex flex-wrap gap-3 mb-6 items-end">
        <div className="flex flex-col">
          <label className="text-xs font-medium text-gray-400 mb-1">Month</label>
          <select
            value={month}
            onChange={handleMonthChange}
            className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:border-[#FFD700] outline-none"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {new Date(0, m - 1).toLocaleString("en-IN", { month: "long" })}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-xs font-medium text-gray-400 mb-1">Year</label>
          <input
            type="number"
            min="2023"
            max={now.getFullYear()}
            value={year}
            onChange={handleYearChange}
            className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:border-[#FFD700] outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-[#2a2a2a] rounded-xl bg-[#1a1a1a] shadow-xl">
        <table className="w-full text-sm text-left min-w-[900px]">
          <thead className="bg-[#222] text-[#FFD700] border-b-2 border-[#FFD700]/20">
            <tr>
              <th className="p-3 sm:p-4 font-semibold whitespace-nowrap">Name</th>
              <th className="p-3 sm:p-4 font-semibold whitespace-nowrap">User ID</th>
              {/* <th className="p-3 sm:p-4 font-semibold whitespace-nowrap">Department</th> */}
              <th className="p-3 sm:p-4 font-semibold whitespace-nowrap">Designation</th>
              <th className="p-3 sm:p-4 font-semibold whitespace-nowrap">Present</th>
              <th className="p-3 sm:p-4 font-semibold whitespace-nowrap">Absent</th>
              <th className="p-3 sm:p-4 font-semibold whitespace-nowrap">% Attendance</th>
              <th className="p-3 sm:p-4 text-center font-semibold whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="8" className="text-center py-12 text-gray-400">
                  <RefreshCw size={24} className="animate-spin inline text-[#FFD700]" /> Loading...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan="8" className="text-center py-12 text-red-400">
                  Failed to fetch monthly stats
                </td>
              </tr>
            ) : stats.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-12 text-gray-400">
                  No employee stats found
                </td>
              </tr>
            ) : (
              stats.map((emp, idx) => (
                <tr
                  key={idx}
                  className="border-b border-[#2a2a2a] hover:bg-[#2a2a2a]/60 transition-colors"
                >
                  <td className="p-3 sm:p-4 text-gray-200 font-medium">{emp.name}</td>
                  <td className="p-3 sm:p-4 text-gray-300 font-mono">{emp.employeeId}</td>
                  {/* <td className="p-3 sm:p-4 text-gray-300">{emp.department}</td> */}
                  <td className="p-3 sm:p-4 text-gray-300">{emp.designation}</td>
                  <td className="p-3 sm:p-4 text-green-400 font-semibold">{emp.presentDays}</td>
                  <td className="p-3 sm:p-4 text-red-400 font-semibold">{emp.absentDays}</td>
                  <td className="p-3 sm:p-4 text-[#FFD700] font-semibold">
                    {emp.attendancePercentage}%
                  </td>
                  <td className="p-3 sm:p-4 text-center">
                    <button
                      onClick={() => {
  setSelectedUser(emp);
  setSelectedUserId(emp.userId);
}}

                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FFD700]/15 text-[#FFD700] rounded-lg hover:bg-[#FFD700]/25 transition-all duration-200 text-xs font-semibold border border-[#FFD700]/30"
                    >
                      <Eye size={14} /> View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      {!isLoading && !isError && stats.length > 0 && (
        <div className="mt-4 text-end text-sm text-gray-400">
          Showing <span className="text-[#FFD700] font-semibold">{stats.length}</span> employee records
          (Working Days: <span className="text-[#FFD700]">{totalWorkingDays}</span>)
        </div>
      )}

      {/* --- Modal --- */}
      {selectedUser && (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 w-[95%] sm:w-[600px] max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-[#FFD700]">
          {selectedUser.name}
        </h2>
        <button
          onClick={() => {
            setSelectedUser(null);
            setSelectedUserId(null);
          }}
        >
          <X size={20} className="text-gray-400 hover:text-white" />
        </button>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-300 mb-4">
        <p>
          <span className="text-gray-400">User ID:</span> {selectedUser.userId}
        </p>
        <p>
          <span className="text-gray-400">Email:</span> {selectedUser.email}
        </p>
        <p>
          <span className="text-gray-400">Department:</span> {selectedUser.department}
        </p>
        <p>
          <span className="text-gray-400">Designation:</span> {selectedUser.designation}
        </p>
      </div>

      {/* Attendance Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm text-gray-300">
        <div className="bg-[#222] rounded-lg p-3 text-center">
          <p className="text-green-400 font-semibold text-lg">
            {selectedUser.presentDays}
          </p>
          <p className="text-gray-400 text-xs mt-1">Present Days</p>
        </div>
        <div className="bg-[#222] rounded-lg p-3 text-center">
          <p className="text-red-400 font-semibold text-lg">
            {selectedUser.absentDays}
          </p>
          <p className="text-gray-400 text-xs mt-1">Absent Days</p>
        </div>
        <div className="bg-[#222] rounded-lg p-3 text-center">
          <p className="text-[#FFD700] font-semibold text-lg">
            {selectedUser.attendancePercentage}%
          </p>
          <p className="text-gray-400 text-xs mt-1">Attendance %</p>
        </div>
        <div className="bg-[#222] rounded-lg p-3 text-center">
          <p className="text-blue-400 font-semibold text-lg">
            {selectedUser.totalRecordedDays}
          </p>
          <p className="text-gray-400 text-xs mt-1">Recorded Days</p>
        </div>
        <div className="bg-[#222] rounded-lg p-3 text-center">
          <p className="text-orange-400 font-semibold text-lg">
            {selectedUser.daysNotMarked}
          </p>
          <p className="text-gray-400 text-xs mt-1">Days Not Marked</p>
        </div>
        <div className="bg-[#222] rounded-lg p-3 text-center">
          <p className="text-cyan-400 font-semibold text-lg">
            {selectedUser.totalWorkingDays}
          </p>
          <p className="text-gray-400 text-xs mt-1">Total Working Days</p>
        </div>
      </div>

      <hr className="my-4 border-[#2a2a2a]" />

      {/* Leaves Used This Month */}
      <h3 className="text-[#FFD700] font-semibold mb-2">
        Leaves Used This Month
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-gray-300">
        {Object.entries(selectedUser.leavesUsedThisMonth || {}).map(
          ([k, v]) => (
            <p key={k}>
              <span className="text-gray-400 capitalize">
                {k.replace(/([A-Z])/g, " $1")}:
              </span>{" "}
              {v}
            </p>
          )
        )}
      </div>

      <hr className="my-4 border-[#2a2a2a]" />

      {/* Leave Balance */}
      <h3 className="text-[#FFD700] font-semibold mb-2">Leave Balance</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-gray-300">
        {Object.entries(selectedUser.leaveBalance || {}).map(([k, v]) => (
          <p key={k}>
            <span className="text-gray-400 capitalize">
              {k.replace(/([A-Z])/g, " $1")}:
            </span>{" "}
            {v}
          </p>
        ))}
      </div>
    </div>
  </div>
)}

    </div>
  );
}
