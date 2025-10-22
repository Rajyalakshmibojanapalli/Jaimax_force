import React, { useState } from "react";
import {
  CalendarDays,
  User,
  FileText,
  CheckCircle,
  XCircle,
  Eye,
} from "lucide-react";
import {
  useGetAllLeavesQuery,
  useApproveLeaveMutation,
  useRejectLeaveMutation,
  useCancelLeaveMutation,
} from "../../features/leaves/leavesApiSlice"
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AppliedLeaves() {
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [reviewComments, setReviewComments] = useState("");

  // RTK Query hooks
  const { data, isLoading, isError, refetch } = useGetAllLeavesQuery();
  const [approveLeave, { isLoading: approving }] = useApproveLeaveMutation();
  const [rejectLeave, { isLoading: rejecting }] = useRejectLeaveMutation();
  const [cancelLeave, { isLoading: canceling }] = useCancelLeaveMutation();

  const leaves = data?.data?.leaves?.filter((l) => l.status === "pending") || [];

  const handleApprove = async (id) => {
    if (!reviewComments.trim()) {
      toast.warning("Please add review comments before approving.", { theme: "dark" });
      return;
    }
    try {
      const res = await approveLeave({ id, body: { reviewComments } }).unwrap();
      toast.success(res?.message || "Leave approved successfully!", { theme: "dark" });
      setSelectedLeave(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to approve leave", { theme: "dark" });
    }
  };

  const handleReject = async (id) => {
    if (!reviewComments.trim()) {
      toast.warning("Please add reason for rejection.", { theme: "dark" });
      return;
    }
    try {
      const res = await rejectLeave({ id, body: { reviewComments } }).unwrap();
      toast.success(res?.message || "Leave rejected.", { theme: "dark" });
      setSelectedLeave(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to reject leave", { theme: "dark" });
    }
  };

  const handleCancel = async (id) => {
    try {
      const res = await cancelLeave(id).unwrap();
      toast.success(res?.message || "Leave request cancelled.", { theme: "dark" });
      setSelectedLeave(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to cancel leave", { theme: "dark" });
    }
  };

  return (
    <div className="flex flex-col flex-1 overflow-y-auto bg-[#0f0f0f] text-white p-6 md:p-8">
      <ToastContainer />
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-[#FFD700] flex items-center gap-2">
          <CalendarDays size={24} /> Applied Leaves (Pending)
        </h1>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-[#FFD700] text-black font-semibold rounded-full hover:bg-[#e6c600] transition"
        >
          Refresh
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden shadow-md">
        {isLoading ? (
          <p className="p-4 text-gray-400">Loading...</p>
        ) : isError ? (
          <p className="p-4 text-red-400">Error loading data.</p>
        ) : leaves.length === 0 ? (
          <p className="p-4 text-gray-400">No pending leave requests found.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-[#222] text-[#FFD700]">
              <tr>
                <th className="p-3 text-left">Employee</th>
                <th className="p-3 text-left">Leave Type</th>
                <th className="p-3 text-left">Duration</th>
                <th className="p-3 text-left">Department</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((leave) => (
                <tr
                  key={leave.leaveId}
                  className="border-b border-[#2a2a2a] hover:bg-[#2a2a2a]/40 transition"
                >
                  <td className="p-3">
                    <div className="flex flex-col">
                      <span className="font-semibold text-white">
                        {leave.employeeName}
                      </span>
                      <span className="text-gray-400 text-xs">
                        {leave.employeeId}
                      </span>
                    </div>
                  </td>
                  <td className="p-3 capitalize">{leave.leaveType}</td>
                  <td className="p-3 text-gray-300">
                    {new Date(leave.startDate).toLocaleDateString("en-GB")} -{" "}
                    {new Date(leave.endDate).toLocaleDateString("en-GB")}
                  </td>
                  <td className="p-3">{leave.department}</td>
                  <td className="p-3">
                    <StatusPill status={leave.status} />
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => setSelectedLeave(leave)}
                      className="flex items-center justify-center gap-1 mx-auto px-3 py-1 text-sm bg-[#FFD700]/10 border border-[#FFD700]/40 rounded-md hover:bg-[#FFD700]/20 transition"
                    >
                      <Eye size={16} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* View Details Modal */}
      {selectedLeave && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-[#1a1a1a] border border-[#FFD700]/30 rounded-xl p-8 w-[90%] max-w-lg relative shadow-lg">
            <button
              onClick={() => setSelectedLeave(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-[#FFD700] mb-4 flex items-center gap-2">
              <User size={22} /> {selectedLeave.employeeName}
            </h2>

            <div className="space-y-3 text-sm text-gray-300">
              <Info label="Employee ID" value={selectedLeave.employeeId} />
              <Info label="Department" value={selectedLeave.department} />
              <Info label="Leave Type" value={selectedLeave.leaveType} />
              <Info
                label="Duration"
                value={`${new Date(selectedLeave.startDate).toLocaleDateString("en-GB")} - ${new Date(selectedLeave.endDate).toLocaleDateString("en-GB")}`}
              />
              <Info label="Total Days" value={selectedLeave.totalDays} />
              <Info label="Reason" value={selectedLeave.reason} />
              <Info label="Status" value={<StatusPill status={selectedLeave.status} />} />
              {selectedLeave.attachments?.length > 0 && (
                <Info
                  label="Document"
                  value={
                    <a
                      href={selectedLeave.attachments[0].fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#FFD700] underline flex items-center gap-1"
                    >
                      <FileText size={14} /> {selectedLeave.attachments[0].fileName}
                    </a>
                  }
                />
              )}
            </div>

            {/* Review Comments */}
            <div className="mt-4">
              <label className="block text-sm text-gray-300 mb-2">
                Review Comments
              </label>
              <textarea
                value={reviewComments}
                onChange={(e) => setReviewComments(e.target.value)}
                placeholder="Add approval or rejection remarks..."
                className="w-full p-2 rounded-md bg-[#111] border border-[#333] text-gray-200 focus:border-[#FFD700] outline-none h-20 resize-none"
              />
            </div>

            {/* Approve/Reject/Cancel Buttons */}
            <div className="flex justify-end gap-4 mt-6 flex-wrap">
              <button
                onClick={() => handleCancel(selectedLeave.leaveId)}
                disabled={canceling}
                className="px-5 py-2 border border-gray-500 text-gray-300 rounded-full hover:bg-[#222] transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(selectedLeave.leaveId)}
                disabled={rejecting}
                className="px-5 py-2 border border-red-600 text-red-400 rounded-full hover:bg-red-800/30 transition disabled:opacity-50"
              >
                <XCircle size={16} className="inline mr-1" />
                {rejecting ? "Rejecting..." : "Reject"}
              </button>
              <button
                onClick={() => handleApprove(selectedLeave.leaveId)}
                disabled={approving}
                className="px-5 py-2 bg-gradient-to-r from-[#18a04a] to-[#c1d42c] text-black rounded-full font-semibold hover:scale-105 transition disabled:opacity-50"
              >
                <CheckCircle size={16} className="inline mr-1" />
                {approving ? "Approving..." : "Approve"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* Reusable Status Pill */
const StatusPill = ({ status }) => {
  const color =
    status === "approved"
      ? "text-green-400 bg-green-900/20 border-green-700/30"
      : status === "rejected"
      ? "text-red-400 bg-red-900/20 border-red-700/30"
      : "text-yellow-400 bg-yellow-900/20 border-yellow-700/30";

  return (
    <span
      className={`px-3 py-1 text-xs font-semibold rounded-full border ${color}`}
    >
      {status?.toUpperCase()}
    </span>
  );
};

/* Reusable Info */
const Info = ({ label, value }) => (
  <p className="flex justify-between items-center border-b border-[#2a2a2a] py-2">
    <span className="text-gray-400">{label}</span>
    <span className="text-white text-sm">{value}</span>
  </p>
);
