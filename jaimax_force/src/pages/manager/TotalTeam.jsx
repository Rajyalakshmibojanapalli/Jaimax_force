import {
  Edit3,
  Trash2,
  Users,
  Power,
  PowerOff,
  AlertTriangle,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
  useGetAllEmployeesQuery,
} from "../../features/onboarding/onboardingApiSlice";
import {
  useActivateEmployeeMutation,
  useDeactivateEmployeeMutation,
  useDeleteEmployeeMutation,
} from "../../features/hrAccess/hrApiSlice";
import UpdateEmployeeModal from "./UpdateEmployeeModal";

export default function TotalTeam() {
  const { data, isLoading, refetch } = useGetAllEmployeesQuery();
  const user = useSelector((state) => state.auth.user);
  const role = user?.role?.toLowerCase() || null;

  const [activateEmployee] = useActivateEmployeeMutation();
  const [deactivateEmployee] = useDeactivateEmployeeMutation();
  const [deleteEmployee] = useDeleteEmployeeMutation();

  const [showModal, setShowModal] = useState(null);
  const [permanentDelete, setPermanentDelete] = useState(false);
  const [reason, setReason] = useState("");
  const [exitReason, setExitReason] = useState("");
  const [showUpdateModal, setShowUpdateModal] = useState(null);

  const completedTeam = useMemo(() => {
    const employees = data?.data?.employees || [];
    return employees.filter(
      (emp) =>
        emp?.onboarding?.status?.toLowerCase() === "completed" &&
        emp?.status?.isVerified
    );
  }, [data]);

  const doActivate = async (id) => {
    try {
      const res = await activateEmployee(id).unwrap();
      toast.success(res?.message || "Employee activated successfully!");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to activate employee");
    } finally {
      setShowModal(null);
    }
  };

  const doDeactivate = async (id) => {
    if (!reason.trim()) return toast.error("Please provide a reason.");
    try {
      const res = await deactivateEmployee({ employeeId: id, reason }).unwrap();
      toast.success(res?.message || "Employee deactivated successfully!");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to deactivate employee");
    } finally {
      setShowModal(null);
      setReason("");
    }
  };

  const doDelete = async (id) => {
    try {
      const payload = { employeeId: id };
      if (permanentDelete) payload.permanent = true;
      else {
        if (!exitReason.trim()) return toast.error("Please provide exit reason.");
        payload.exitReason = exitReason;
      }
      const res = await deleteEmployee(payload).unwrap();
      toast.success(res?.message || "Employee deleted successfully!");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete employee");
    } finally {
      setShowModal(null);
      setPermanentDelete(false);
      setExitReason("");
    }
  };

  return (
    <div className="flex flex-col flex-1 overflow-x-auto bg-[#0f0f0f] text-white p-2 sm:p-2">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-[#FFD700] flex items-center gap-2">
          <Users size={22} /> Total Team
        </h1>
      </div>

      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-x-auto shadow-md w-full">
        <table className="w-full text-xs sm:text-sm">
          <thead className="bg-[#222] text-[#FFD700] whitespace-nowrap">
            <tr className="text-center">
              <th className="p-3 text-center">Employee ID</th>
              <th className="p-3 text-center">Name</th>
              <th className="p-3 text-center">Department</th>
              <th className="p-3 text-center">Role</th>
              <th className="p-3 text-center">Verified</th>
              <th className="p-3 text-center">Active</th>
              <th className="p-3 text-center w-[180px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="7" className="p-6 text-center text-gray-400">
                  Loading team members...
                </td>
              </tr>
            ) : completedTeam.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-6 text-center text-gray-400">
                  No completed & verified employees found.
                </td>
              </tr>
            ) : (
              completedTeam.map((member) => (
                <tr
                  key={member._id}
                  className="border-b border-[#2a2a2a] hover:bg-[#2a2a2a]/40 transition"
                >
                  <td className="p-3 text-center">{member.employeeId}</td>
                  <td className="p-3 font-semibold text-center">{member.fullName}</td>
                  <td className="p-3 text-center">{member.companyInfo?.department || "N/A"}</td>
                  <td className="p-3 capitalize text-center">
                    {member.authentication?.role || "N/A"}
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full border ${
                        member.status?.isVerified
                          ? "text-green-400 bg-green-900/20 border-green-700/30"
                          : "text-yellow-400 bg-yellow-900/20 border-yellow-700/30"
                      }`}
                    >
                      {member.status?.isVerified ? "Verified" : "Pending"}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full border ${
                        member.status?.isActive
                          ? "text-green-400 bg-green-900/20 border-green-700/30"
                          : "text-red-400 bg-red-900/20 border-red-700/30"
                      }`}
                    >
                      {member.status?.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  {["hr", "admin"].includes(role) ? (
                    <td className="p-3 col-span-5 text-center">
                      <div className="flex justify-center gap-3 whitespace-nowrap">
                        {/* Edit */}
                        <div className="relative group">
                          <button
                            className="p-2 bg-blue-500/10 rounded-md border border-blue-500/30 hover:bg-blue-500/20 transition"
                            onClick={() => setShowUpdateModal(member.employeeId)}
                          >
                            <Edit3 size={16} />
                          </button>
                          <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-[#FFD700] text-black text-[12px] font-semibold rounded px-2 py-0.5 whitespace-nowrap">
                            Update
                          </span>
                        </div>

                        {/* Activate / Deactivate */}
                        <div className="relative group">
                          {member.status?.isActive ? (
                            <button
                              className="p-2 bg-red-500/10 rounded-md border border-red-500/30 hover:bg-red-500/20 transition"
                              onClick={() =>
                                setShowModal({ type: "deactivate", id: member.employeeId })
                              }
                            >
                              <PowerOff size={16} />
                            </button>
                          ) : (
                            <button
                              className="p-2 bg-green-500/10 rounded-md border border-green-500/30 hover:bg-green-500/20 transition"
                              onClick={() =>
                                setShowModal({ type: "activate", id: member.employeeId })
                              }
                            >
                              <Power size={16} />
                            </button>
                          )}
                          <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-[#FFD700] text-black text-[12px] font-semibold rounded px-2 py-0.5 whitespace-nowrap">
                            {member.status?.isActive ? "Deactivate" : "Activate"}
                          </span>
                        </div>

                        {/* 🗑 Delete */}
                        <div className="relative group">
                          <button
                            className="p-2 bg-red-700/10 rounded-md border border-red-700/30 hover:bg-red-700/20 transition"
                            onClick={() =>
                              setShowModal({ type: "delete", id: member.employeeId })
                            }
                          >
                            <Trash2 size={16} />
                          </button>
                          <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-[#FFD700] text-black text-[12px] font-semibold rounded px-2 py-0.5 whitespace-nowrap">
                            Delete
                          </span>
                        </div>
                      </div>
                    </td>
                  ) : (
                    <td className="p-3 text-center text-gray-500">—</td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Shared Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-[#1a1a1a] border border-[#FFD700]/30 rounded-xl p-4 sm:p-6 w-full max-w-md text-center shadow-xl">
            <h3 className="text-lg sm:text-xl font-bold text-[#FFD700] mb-3 flex justify-center items-center gap-2">
              <AlertTriangle size={20} /> {showModal.type.toUpperCase()}
            </h3>

            {showModal.type === "activate" && (
              <p className="text-gray-300 mb-5 text-sm sm:text-base">
                Are you sure you want to{" "}
                <span className="text-green-400">activate</span> this employee?
              </p>
            )}

            {showModal.type === "deactivate" && (
              <>
                <p className="text-gray-300 mb-4 text-sm sm:text-base">
                  Enter a reason for{" "}
                  <span className="text-red-400">deactivation</span>:
                </p>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows="3"
                  className="w-full bg-[#111] border border-[#333] rounded-md text-gray-200 p-2 text-sm sm:text-base"
                />
              </>
            )}

            {showModal.type === "delete" && (
              <>
                <p className="text-gray-300 mb-4 text-sm sm:text-base">
                  Are you sure you want to{" "}
                  <span className="text-red-500 font-semibold">delete</span> this employee?
                </p>
                <label className="flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-400 mb-3">
                  <input
                    type="checkbox"
                    checked={permanentDelete}
                    onChange={(e) => setPermanentDelete(e.target.checked)}
                  />
                  Permanent Delete (completely remove from DB)
                </label>
                {!permanentDelete && (
                  <>
                    <p className="text-gray-400 mb-2 text-xs sm:text-sm">
                      Please provide exit reason:
                    </p>
                    <textarea
                      value={exitReason}
                      onChange={(e) => setExitReason(e.target.value)}
                      rows="3"
                      placeholder="Enter reason for deleting..."
                      className="w-full bg-[#111] border border-[#333] rounded-md text-gray-200 p-2 text-sm sm:text-base"
                    />
                  </>
                )}
              </>
            )}

            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={() => setShowModal(null)}
                className="px-5 py-2 border border-gray-500 rounded-full text-gray-300 hover:bg-[#222] transition text-sm sm:text-base w-full sm:w-auto"
              >
                Cancel
              </button>

              {showModal.type === "activate" && (
                <button
                  onClick={() => doActivate(showModal.id)}
                  className="px-6 py-2 bg-[#FFD700] text-black font-semibold rounded-full text-sm sm:text-base w-full sm:w-auto"
                >
                  Confirm
                </button>
              )}

              {showModal.type === "deactivate" && (
                <button
                  onClick={() => doDeactivate(showModal.id)}
                  className="px-6 py-2 bg-[#FFD700] text-black font-semibold rounded-full text-sm sm:text-base w-full sm:w-auto"
                >
                  Confirm
                </button>
              )}

              {showModal.type === "delete" && (
                <button
                  onClick={() => doDelete(showModal.id)}
                  className="px-6 py-2 bg-[#FFD700] text-black font-semibold rounded-full text-sm sm:text-base w-full sm:w-auto"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {showUpdateModal && (
        <UpdateEmployeeModal
          employeeId={showUpdateModal}
          onClose={() => setShowUpdateModal(null)}
          refetch={refetch}
        />
      )}
    </div>
  );
}
