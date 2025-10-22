// src/pages/leaves/TeamLeaves.jsx
import React, { useState } from "react";
import { CalendarDays, FileText, X } from "lucide-react";
import {
  useGetAllLeavesQuery,
  useGetSingleLeaveQuery,
} from "../../features/leaves/leavesApiSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function TeamLeaves() {
  const { data, isLoading, isError, refetch } = useGetAllLeavesQuery();
  const leaves = data?.data?.leaves || [];

  const handleOpenFile = (url) => {
    if (!url) return toast.info("No attachment found", { theme: "dark" });
    window.open(url, "_blank");
  };

  const [selectedLeaveId, setSelectedLeaveId] = useState(null);
  const { data: singleLeaveData, isLoading: singleLoading } =
    useGetSingleLeaveQuery(selectedLeaveId, { skip: !selectedLeaveId });

  return (
    <div className="flex flex-col flex-1 bg-[#0f0f0f] text-white p-6 md:p-8">
      <ToastContainer />

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <CalendarDays size={28} className="text-[#FFD700]" />
          <h1 className="text-2xl font-bold text-[#FFD700]">
            Team Leave Applications
          </h1>
        </div>

        <button
          onClick={() => {
            refetch();
            toast.success("Refreshed", { theme: "dark" });
          }}
          className="px-4 py-2 bg-[#FFD700] text-black font-semibold rounded-full hover:bg-[#e6c600] transition"
        >
          Refresh
        </button>
      </div>

      {/* Leave Applications Table */}
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 shadow-md">
        {isLoading ? (
          <p className="text-gray-400 text-sm">Loading team leaves...</p>
        ) : isError ? (
          <p className="text-red-400 text-sm">Failed to load data.</p>
        ) : leaves.length === 0 ? (
          <p className="text-gray-400 text-sm">No team leave records found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border border-[#2a2a2a] rounded-lg overflow-hidden">
              <thead className="bg-[#222] text-[#FFD700]">
                <tr>
                  <th className="p-3 text-left">Employee ID</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Department</th>
                  <th className="p-3 text-left">Designation</th>
                  <th className="p-3 text-left">Leave Type</th>
                  <th className="p-3 text-left">Start</th>
                  <th className="p-3 text-left">End</th>
                  <th className="p-3 text-left">Days</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Reason</th>
                  <th className="p-3 text-left">Reviewed By</th>
                  <th className="p-3 text-left">Attachments</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((leave, i) => (
                  <tr
                    key={i}
                    className="border-t border-[#2a2a2a] hover:bg-[#2a2a2a]/40 transition"
                  >
                    <td className="p-3 text-gray-300">{leave.employeeId}</td>
                    <td className="p-3 text-gray-200">{leave.employeeName}</td>
                    <td className="p-3 text-gray-300">{leave.department}</td>
                    <td className="p-3 text-gray-300">{leave.designation}</td>
                    <td className="p-3 capitalize text-gray-200">
                      {leave.leaveType}
                    </td>
                    <td className="p-3 text-gray-300">
                      {new Date(leave.startDate).toLocaleDateString("en-IN")}
                    </td>
                    <td className="p-3 text-gray-300">
                      {new Date(leave.endDate).toLocaleDateString("en-IN")}
                    </td>
                    <td className="p-3 text-gray-300">{leave.totalDays}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          leave.status === "approved"
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : leave.status === "pending"
                            ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                            : "bg-red-500/20 text-red-400 border border-red-500/30"
                        }`}
                      >
                        {leave.status}
                      </span>
                    </td>
                    <td className="p-3 text-gray-400 max-w-[200px] truncate">
                      {leave.reason}
                    </td>
                    <td className="p-3 text-gray-300">
                      {leave.reviewedBy || "-"}
                    </td>
                    <td className="p-3">
                      {leave.attachments?.length > 0 ? (
                        <button
                          onClick={() =>
                            handleOpenFile(leave.attachments[0].fileUrl)
                          }
                          className="flex items-center gap-1 text-[#FFD700] hover:underline"
                        >
                          <FileText size={14} /> View
                        </button>
                      ) : (
                        <span className="text-gray-500 text-xs">No file</span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => setSelectedLeaveId(leave.leaveId)}
                        className="text-[#FFD700] hover:underline text-sm"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
       {selectedLeaveId && (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 w-[95%] sm:w-[600px] relative shadow-lg">
      <button
        onClick={() => setSelectedLeaveId(null)}
        className="absolute top-3 right-3 text-gray-400 hover:text-white"
      >
        <X size={20} />
      </button>

      {singleLoading ? (
        <p className="text-gray-400">Loading leave details...</p>
      ) : (
        <>
          <h2 className="text-lg font-bold text-[#FFD700] mb-4">
            Leave Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-300">
            <p><span className="text-gray-400">Employee ID:</span> {singleLeaveData?.data?.employeeId}</p>
            <p><span className="text-gray-400">Name:</span> {singleLeaveData?.data?.employeeName}</p>
            <p><span className="text-gray-400">Department:</span> {singleLeaveData?.data?.department}</p>
            <p><span className="text-gray-400">Designation:</span> {singleLeaveData?.data?.designation}</p>
            <p><span className="text-gray-400">Leave Type:</span> {singleLeaveData?.data?.leaveType}</p>
            <p><span className="text-gray-400">Total Days:</span> {singleLeaveData?.data?.totalDays}</p>
            <p><span className="text-gray-400">Status:</span>{" "}
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  singleLeaveData?.data?.status === "approved"
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : singleLeaveData?.data?.status === "pending"
                    ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                    : "bg-red-500/20 text-red-400 border border-red-500/30"
                }`}
              >
                {singleLeaveData?.data?.status}
              </span>
            </p>
            <p><span className="text-gray-400">Applied On:</span> {new Date(singleLeaveData?.data?.appliedOn).toLocaleString("en-IN")}</p>
          </div>

          <hr className="my-4 border-[#2a2a2a]" />

          <div className="text-sm text-gray-300 space-y-2">
            <p><span className="text-gray-400">Start Date:</span> {new Date(singleLeaveData?.data?.startDate).toLocaleDateString("en-IN")}</p>
            <p><span className="text-gray-400">End Date:</span> {new Date(singleLeaveData?.data?.endDate).toLocaleDateString("en-IN")}</p>
            <p><span className="text-gray-400">Reason:</span> {singleLeaveData?.data?.reason}</p>
          </div>

          {singleLeaveData?.data?.reviewedBy && (
            <>
              <hr className="my-4 border-[#2a2a2a]" />
              <div className="text-sm text-gray-300 space-y-2">
                <p><span className="text-gray-400">Reviewed By:</span> {singleLeaveData?.data?.reviewedBy}</p>
                <p><span className="text-gray-400">Reviewed On:</span> {new Date(singleLeaveData?.data?.reviewedOn).toLocaleString("en-IN")}</p>
                {singleLeaveData?.data?.reviewComments && (
                  <p><span className="text-gray-400">Comments:</span> {singleLeaveData?.data?.reviewComments}</p>
                )}
              </div>
            </>
          )}

          {singleLeaveData?.data?.attachments?.length > 0 && (
            <>
              <hr className="my-4 border-[#2a2a2a]" />
              <h3 className="text-[#FFD700] font-semibold mb-2">Attachments</h3>
              {singleLeaveData.data.attachments.map((file) => (
                <button
                  key={file._id}
                  onClick={() => window.open(file.fileUrl, "_blank")}
                  className="flex items-center gap-2 text-[#FFD700] hover:underline text-sm"
                >
                  <FileText size={14} /> {file.fileName}
                </button>
              ))}
            </>
          )}
        </>
      )}
    </div>
  </div>
)}


      </div>
    </div>
  );
}
