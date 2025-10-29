// src/pages/leaves/Leaves.jsx
import React, { useState } from "react";
import { CalendarDays, PlusCircle, FileText, X } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  useApplyLeaveMutation,
  useGetSingleLeaveQuery,
  useCancelLeaveMutation,
} from "../../features/leaves/leavesApiSlice";
import { useSelector } from "react-redux";

export default function Leaves() {
  const { user } = useSelector((state) => state.auth);
  const role = user?.role?.toLowerCase();
  const employeeId = user?.employeeId;

  const [showModal, setShowModal] = useState(false);
  const [leaveType, setLeaveType] = useState("");
  const [reason, setReason] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [attachments, setAttachments] = useState([]);

  // const { data, isLoading, isError } = useGetAllLeavesQuery();
  const {allLeaves: data, summary: summaryData, balance: balanceData }= useSelector((state)=> state.leaves);
  const leaves = data?.leaves || [];
  const filteredLeaves = employeeId ? leaves.filter((item) => item.employeeId === employeeId): [];
  const isLoading = !leaves;
  // console.log("balanceData", balanceData)
  // console.log("data", data)
  // console.log(summaryData)

  const [applyLeave, { isLoading: submitting }] = useApplyLeaveMutation();

  const [selectedLeaveId, setSelectedLeaveId] = useState(null);
  const { data: singleLeaveData, isLoading: singleLoading } =
    useGetSingleLeaveQuery(selectedLeaveId, { skip: !selectedLeaveId });

  const [cancelLeave, { isLoading: canceling }] = useCancelLeaveMutation();

  // const { data: summaryData } = useGetLeavesSummaryQuery(user?.id, {
  //   skip: !user?.id,
  // });
  // const { data: balanceData } = useGetBalancedLeavesQuery(user?.id, {
  //   skip: !user?.id,
  // });

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const fileList = files.map((file) => ({
      fileName: file.name,
      fileUrl: URL.createObjectURL(file),
      uploadedAt: new Date().toISOString(),
    }));
    setAttachments(fileList);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      leaveType,
      startDate,
      endDate,
      reason,
      attachments,
    };
    try {
      const res = await applyLeave(payload).unwrap();
      toast.success(res?.message || "Leave applied successfully!", {
        theme: "dark",
      });
      setShowModal(false);
      setLeaveType("");
      setReason("");
      setStartDate("");
      setEndDate("");
      setAttachments([]);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to apply leave", {
        theme: "dark",
      });
    }
  };

  const handleCancel = async (id) => {
    try {
      const res = await cancelLeave(id).unwrap();
      toast.success(res?.message || "Leave request cancelled.", {
        theme: "dark",
      });
      setSelectedLeaveId(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to cancel leave", {
        theme: "dark",
      });
    }
  };


  return (
    <div className="flex flex-col flex-1 overflow-y-auto bg-[#0f0f0f] text-white p-4 md:p-4">
      <ToastContainer />
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-[#FFD700] flex items-center gap-2">
          <CalendarDays size={24} /> My Leaves
        </h1>

        <button
  onClick={() => setShowModal(true)}
  className="flex items-center justify-center gap-2 bg-[#FFD700] text-black font-semibold px-5 py-2 rounded-full hover:scale-105 transition"
>
  <PlusCircle size={18} />
  {/* Show text only on md and above */}
  <span className="hidden md:inline">Apply Leave</span>
</button>

      </div>

      {/* Leaves Table */}
      {/* <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 shadow-md"> */}
        <h2 className="text-xl font-semibold text-[#FFD700] mb-4">
          Leave History
        </h2>

        {isLoading ? (
          <p className="text-gray-400 text-sm">Loading leaves...</p>
        ) : (!leaves) ? (
          <p className="text-red-400 text-sm">Failed to load leaves.</p>
        ) : filteredLeaves.length === 0 ? (
          <p className="text-gray-400 text-sm">No leave records found.</p>
        ) : (
          <div className="overflow-x-auto border border-[#3d3d3d] rounded-lg">
            <table className="min-w-full text-sm border border-[#2a2a2a] rounded-lg overflow-hidden">
              <thead className="bg-[#FFD700] text-black border-b-2 border-[#3d3d3d]">
                <tr>
                  <th className="p-3 text-left min-w-[120px]">Leave Type</th>
                  <th className="p-3 text-left min-w-[120px]">Start</th>
                  <th className="p-3 text-left min-w-[120px]">End</th>
                  <th className="p-3 text-left">Total Days</th>
                  <th className="p-3 text-left min-w-[100px]">Status</th>
                  <th className="p-3 text-left min-w-[150px]">Reason</th>
                  <th className="p-3 text-left min-w-[120px]">Reviewed By</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((leave, i) => (
                  <tr
                    key={i}
                    className="border-t border-[#2a2a2a] hover:bg-[#2a2a2a]/40 transition"
                  >
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
                        {leave.status || "Pending"}
                      </span>
                    </td>
                    <td className="p-3 text-gray-400">{leave.reason}</td>
                    <td className="p-3 text-gray-400">
                      {leave.reviewedBy || "-"}
                    </td>
                    <td className="p-3">
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
      {/* </div> */}

{/* Leave Balance Section */}
{balanceData?.leaveBalance && (
  <div className="mt-10 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 shadow-md">
    <h2 className="text-xl font-semibold text-[#FFD700] mb-4">
      Leave Balances
    </h2>

    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Object.entries(balanceData.leaveBalance)
  .filter(([key]) => !key.toLowerCase().startsWith("total"))
  .map(([key, remaining]) => {
    const cleanType = key.replace("Leave", "").toLowerCase();
    const totalKey = `total${cleanType}`;
    const total = balanceData.leaveBalance[totalKey] ?? remaining;
    const used = total - remaining;

    return (
      <div
        key={key}
        className="bg-[#111] border border-[#2a2a2a] rounded-xl p-5 hover:border-[#FFD700]/40 transition"
      >
        <p className="text-gray-400 text-sm capitalize mb-2">
          {key.replace(/([A-Z])/g, " $1")}
        </p>
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#FFD700] font-bold">
            {used}/{total}
          </span>
          <span className="text-gray-400">{remaining} Left</span>
        </div>
      </div>
    );
  })}

    </div>
  </div>
)}

{/* Leave Summary Section */}
{summaryData?.summary && (
  <div className="mt-10 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 shadow-md">
    <h2 className="text-xl font-semibold text-[#FFD700] mb-4">
      Leave Summary ({summaryData?.year})
    </h2>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-4 text-center">
        <p className="text-gray-400 text-sm">Total Applied</p>
        <p className="text-2xl font-bold text-[#FFD700]">
          {summaryData?.summary?.totalApplied}
        </p>
      </div>
      <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-4 text-center">
        <p className="text-gray-400 text-sm">Pending</p>
        <p className="text-2xl font-bold text-yellow-400">
          {summaryData?.summary?.pending}
        </p>
      </div>
      <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-4 text-center">
        <p className="text-gray-400 text-sm">Approved</p>
        <p className="text-2xl font-bold text-green-400">
          {summaryData?.summary?.approved}
        </p>
      </div>
      <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-4 text-center">
        <p className="text-gray-400 text-sm">Cancelled</p>
        <p className="text-2xl font-bold text-gray-400">
          {summaryData?.summary?.cancelled}
        </p>
      </div>
      <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-4 text-center">
        <p className="text-gray-400 text-sm">Rejected</p>
        <p className="text-2xl font-bold text-red-400">
          {summaryData?.summary?.rejected}
        </p>
      </div>
      <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-4 text-center">
        <p className="text-gray-400 text-sm">Total Days Taken</p>
        <p className="text-2xl font-bold text-[#FFD700]">
          {summaryData?.summary?.totalDaysTaken}
        </p>
      </div>
    </div>
  </div>
)}


      {/* Apply Leave Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-[#1a1a1a] border border-[#FFD700]/30 rounded-xl p-8 w-[90%] max-w-md relative shadow-lg">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={22} />
            </button>

            <h2 className="text-2xl font-bold text-[#FFD700] mb-6 text-center">
              Apply for Leave
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Leave Type */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Leave Type
                </label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  required
                  className="w-full p-2 rounded-md bg-[#111] border border-[#333] text-gray-200 focus:border-[#FFD700] outline-none"
                >
                  <option value="">Select Leave Type</option>
                  <option value="sick">Sick Leave</option>
                  <option value="casual">Casual Leave</option>
                  <option value="earned">Earned Leave</option>
                  <option value="unpaid">Unpaid Leave</option>
                  <option value="maternity">Maternity Leave</option>
                  <option value="paternity">Paternity Leave</option>
                  <option value="other">Other</option>
                  <option value="privilege">Privilege</option>
                </select>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    className="w-full p-2 rounded-md bg-[#111] border border-[#333] text-gray-200 focus:border-[#FFD700]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                    className="w-full p-2 rounded-md bg-[#111] border border-[#333] text-gray-200 focus:border-[#FFD700]"
                  />
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Reason
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  placeholder="Enter reason for leave..."
                  className="w-full p-2 rounded-md bg-[#111] border border-[#333] text-gray-200 focus:border-[#FFD700] outline-none h-24 resize-none"
                />
              </div>

              {/* Optional Attachment */}
              {(leaveType === "sick" ||
                leaveType === "maternity" ||
                leaveType === "paternity" ||
                leaveType === "other") && (
                <div>
                  <label className="block text-sm text-gray-300 mb-2 flex items-center gap-2">
                    <FileText size={16} /> Upload Supporting Document (optional)
                  </label>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    accept=".jpg,.jpeg,.png,.pdf"
                    className="w-full text-sm text-gray-300 bg-[#111] border border-[#333] p-2 rounded-md"
                  />
                </div>
              )}

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2 border border-gray-600 rounded-full text-gray-300 hover:bg-[#222] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-[#FFD700] text-black rounded-full font-semibold hover:scale-105 transition disabled:opacity-60"
                >
                  {submitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
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
                  <p>
                    <span className="text-gray-400">Employee ID:</span>{" "}
                    {singleLeaveData?.data?.employeeId}
                  </p>
                  <p>
                    <span className="text-gray-400">Name:</span>{" "}
                    {singleLeaveData?.data?.employeeName}
                  </p>
                  <p>
                    <span className="text-gray-400">Department:</span>{" "}
                    {singleLeaveData?.data?.department}
                  </p>
                  <p>
                    <span className="text-gray-400">Designation:</span>{" "}
                    {singleLeaveData?.data?.designation}
                  </p>
                  <p>
                    <span className="text-gray-400">Leave Type:</span>{" "}
                    {singleLeaveData?.data?.leaveType}
                  </p>
                  <p>
                    <span className="text-gray-400">Total Days:</span>{" "}
                    {singleLeaveData?.data?.totalDays}
                  </p>
                  <p>
                    <span className="text-gray-400">Status:</span>{" "}
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
                  <p>
                    <span className="text-gray-400">Applied On:</span>{" "}
                    {new Date(singleLeaveData?.data?.appliedOn).toLocaleString(
                      "en-IN"
                    )}
                  </p>
                </div>

                <hr className="my-4 border-[#2a2a2a]" />

                <div className="text-sm text-gray-300 space-y-2">
                  <p>
                    <span className="text-gray-400">Start Date:</span>{" "}
                    {new Date(
                      singleLeaveData?.data?.startDate
                    ).toLocaleDateString("en-IN")}
                  </p>
                  <p>
                    <span className="text-gray-400">End Date:</span>{" "}
                    {new Date(
                      singleLeaveData?.data?.endDate
                    ).toLocaleDateString("en-IN")}
                  </p>
                  <p>
                    <span className="text-gray-400">Reason:</span>{" "}
                    {singleLeaveData?.data?.reason}
                  </p>
                </div>

                {singleLeaveData?.data?.reviewedBy && (
                  <>
                    <hr className="my-4 border-[#2a2a2a]" />
                    <div className="text-sm text-gray-300 space-y-2">
                      <p>
                        <span className="text-gray-400">Reviewed By:</span>{" "}
                        {singleLeaveData?.data?.reviewedBy}
                      </p>
                      <p>
                        <span className="text-gray-400">Reviewed On:</span>{" "}
                        {new Date(
                          singleLeaveData?.data?.reviewedOn
                        ).toLocaleString("en-IN")}
                      </p>
                      {singleLeaveData?.data?.reviewComments && (
                        <p>
                          <span className="text-gray-400">Comments:</span>{" "}
                          {singleLeaveData?.data?.reviewComments}
                        </p>
                      )}
                    </div>
                  </>
                )}

                {singleLeaveData?.data?.attachments?.length > 0 && (
                  <>
                    <hr className="my-4 border-[#2a2a2a]" />
                    <h3 className="text-[#FFD700] font-semibold mb-2">
                      Attachments
                    </h3>
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
                {singleLeaveData?.data?.status === "pending" && (
                  <div className="flex justify-center pt-5">
                    <button
                      onClick={() => handleCancel(selectedLeaveId)}
                      disabled={canceling}
                      className="px-5 py-2 border border-gray-500 text-gray-300 rounded-full hover:bg-[#222] transition disabled:opacity-50"
                    >
                      Cancel Leave
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
