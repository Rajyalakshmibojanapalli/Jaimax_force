import {
  CheckCircle,
  ClipboardCheck,
  Eye,
  FileText,
  Loader2,
  User,
  XCircle,
  Send,
  ChevronDown,
  ChevronUp,
  Clock,
} from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useCompleteEmployeeOnboardingMutation,
  useGetAllEmployeesQuery,
  useGetEmployeeByIdQuery,
  useVerifyEmployeeSectionMutation,
  useResendInvitationMutation,
} from "../../features/onboarding/onboardingApiSlice";

export default function OnboardMembers() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [remarks, setRemarks] = useState({});
  const [expanded, setExpanded] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [resendingId, setResendingId] = useState(null);

  const { user } = useSelector((state) => state.auth);
  const loggedEmployeeId = user?.employeeId;
  const role = user?.role?.toLowerCase();

  // === Debounce search ===
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedTerm(searchTerm), 1000);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // === Fetch employees ===
  const { data, isLoading } = useGetAllEmployeesQuery({
    searchTerm: debouncedTerm || "",
    page,
    limit,
  });

  const members = data?.data?.employees || [];
  const totalPages = data?.data?.totalPages || 1;

  const [resendInvitation] = useResendInvitationMutation();
  const [verifyEmployeeSection] = useVerifyEmployeeSectionMutation();
  const [completeEmployeeOnboarding] = useCompleteEmployeeOnboardingMutation();

  const {
    data: employeeData,
    isFetching: loadingEmployee,
    refetch,
  } = useGetEmployeeByIdQuery(selectedUser?.employeeId, {
    skip: !selectedUser,
  });

  // === Handlers ===
  const handleVerifySection = async (section, data, key = null) => {
  try {
    const sectionKey = key || section;
    const remark = remarks[sectionKey] || "";
    const payload = { data, isVerified: !remark, remarks: remark };

    await verifyEmployeeSection({
      employeeId: selectedUser.employeeId,
      section: sectionKey,
      payload,
    }).unwrap();

    toast.success(
      remark
        ? `${sectionKey} marked as Rejected`
        : `${sectionKey} Verified Successfully`
    );

    // ✅ Auto-reset UI after success
    setRemarks((prev) => {
      const updated = { ...prev };
      delete updated[sectionKey];
      return updated;
    });

    // Optionally collapse section after action
    setExpanded(null);

    refetch();
  } catch (err) {
    toast.error(err?.data?.message || "Failed to verify section");
  }
};


  const handleCompleteOnboarding = async () => {
    try {
      const res = await completeEmployeeOnboarding(
        selectedUser.employeeId
      ).unwrap();
      toast.success(res?.message || "Onboarding completed successfully");
      refetch();
      setSelectedUser(null);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to complete onboarding");
    }
  };

  const handleResendInvitation = async (member) => {
    try {
      const email = member?.personalInfo?.email;
      if (!email) return toast.warn("Employee email not found.");

      setResendingId(member.employeeId);
      const res = await resendInvitation({ email }).unwrap();
      toast.success(res?.message || "Invitation resent successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to resend invitation");
    } finally {
      setResendingId(null);
    }
  };

  // === Verify check ===
  const allSectionsVerified = useMemo(() => {
    const emp = employeeData?.data?.employee;
    if (!emp) return false;

    const isVerifiedSection = (section) => {
      if (!section) return false;
      if (Array.isArray(section)) return section.every(isVerifiedSection);
      return section?.isVerified === true;
    };

    const checks = [
      isVerifiedSection(emp.personalInfo),
      isVerifiedSection(emp.personalInfo?.address),
      isVerifiedSection(emp.personalInfo?.permanentAddress),
      isVerifiedSection(emp.personalInfo?.emergencyContact),
      isVerifiedSection(emp.companyInfo?.bankDetails),
      isVerifiedSection(emp.education),
      isVerifiedSection(emp.experience),
      isVerifiedSection(emp.documents),
    ];
    return checks.every(Boolean);
  }, [employeeData]);

  const onboardingStatus =
    employeeData?.data?.employee?.onboarding?.status || "";
  const isCompleted = onboardingStatus.toLowerCase() === "completed";

  // === Render ===
  return (
    <div className="flex flex-col flex-1 bg-[#0f0f0f] text-white p-2 md:p-2">
      <h1 className="text-2xl font-bold mb-6 text-[#FFD700] flex items-center gap-2">
        <ClipboardCheck size={22} /> Onboarded Members
      </h1>

      {/* === Search === */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <input
          type="text"
          placeholder="Search employee name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-2 rounded-md bg-[#1a1a1a] border border-[#2a2a2a] text-white placeholder-gray-400 focus:outline-none focus:border-[#FFD700] w-full sm:w-72"
        />
      </div>

      {/* === Table === */}
      <div className="overflow-x-auto rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] shadow-md">
        <table className="w-full text-sm">
          <thead className="bg-[#222] text-[#FFD700]">
            <tr>
              <th className="p-3 text-left">Employee ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Department</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-400">
                  <Loader2 size={20} className="inline animate-spin mr-2" />
                  Loading employees...
                </td>
              </tr>
            ) : members.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-400">
                  No employees found.
                </td>
              </tr>
            ) : (
              members.map((m) => (
                <tr
                  key={m._id}
                  className="border-b border-[#2a2a2a] hover:bg-[#2a2a2a]/40 transition"
                >
                  <td className="p-3">{m.employeeId}</td>
                  <td className="p-3">{m.fullName || "N/A"}</td>
                  <td className="p-3">{m.personalInfo?.email || "N/A"}</td>
                  <td className="p-3">{m.companyInfo?.department || "N/A"}</td>
                  <td className="p-3 capitalize">
                    {m.authentication?.role || "N/A"}
                  </td>

                  <td className="p-3 flex justify-center gap-2 flex-wrap">
                    {m.onboarding?.status === "completed" ? (
                      <div className="flex items-center gap-2">
                        <span className="text-green-400 font-semibold">
                          Completed
                        </span>
                        {/* {role === "admin" && (
                          <button
                            onClick={() => setSelectedUser(m)}
                            className="hidden sm:flex px-3 py-1 rounded-md bg-[#222] text-[#FFD700] hover:bg-[#333] text-sm"
                            title="View Employee Details"
                          >
                            View
                          </button>

                        )} */}
                      </div>
                    ) : (
                      <>
                        {/* === REVIEW === */}
                        <button
                          onClick={() => {
                            if (m.employeeId === loggedEmployeeId)
                              return toast.info(
                                "You cannot verify or reject your own details."
                              );
                            setSelectedUser(m);
                          }}
                          disabled={m.employeeId === loggedEmployeeId}
                          className={`rounded-md font-semibold flex items-center justify-center gap-1 transition ${
                            m.employeeId === loggedEmployeeId
                              ? "bg-gray-600 text-gray-300 cursor-not-allowed opacity-60"
                              : "bg-[#FFD700] text-black hover:bg-[#ffe55c]"
                          } px-3 py-2`}
                          title="Review Employee"
                        >
                          <Eye size={16} />
                          <span className="hidden sm:inline">Review</span>
                        </button>

                        {/* === RESEND === */}
                        {["hr", "admin"].includes(role) && (
                          <button
                            onClick={() => handleResendInvitation(m)}
                            disabled={resendingId === m.employeeId}
                            className={`rounded-md font-semibold flex items-center justify-center gap-1 transition ${
                              resendingId === m.employeeId
                                ? "bg-gray-600 text-gray-300 cursor-not-allowed opacity-60"
                                : "bg-[#FFD700] text-black hover:bg-[#ffe55c]"
                            } px-3 py-2`}
                            title="Resend Invitation"
                          >
                            {resendingId === m.employeeId ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <Send size={15} />
                            )}
                            <span className="hidden sm:inline">
                              {resendingId === m.employeeId
                                ? "Sending..."
                                : "Resend"}
                            </span>
                          </button>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* === Pagination === */}
      <div className="flex justify-center sm:justify-end items-center gap-3 mt-6">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          className={`px-4 py-1.5 rounded-md border border-[#333] transition ${
            page <= 1
              ? "text-gray-500 cursor-not-allowed opacity-60"
              : "text-gray-200 hover:bg-[#2a2a2a]"
          }`}
        >
          Prev
        </button>

        <span className="text-[#FFD700] font-semibold">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          className={`px-4 py-1.5 rounded-md border border-[#333] transition ${
            page >= totalPages
              ? "text-gray-500 cursor-not-allowed opacity-60"
              : "text-gray-200 hover:bg-[#2a2a2a]"
          }`}
        >
          Next
        </button>
      </div>

      {selectedUser && (
        <ReviewModal
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          remarks={remarks}
          setRemarks={setRemarks}
          expanded={expanded}
          setExpanded={setExpanded}
          loadingEmployee={loadingEmployee}
          employeeData={employeeData}
          handleVerifySection={handleVerifySection}
          handleCompleteOnboarding={handleCompleteOnboarding}
          allSectionsVerified={allSectionsVerified}
          isCompleted={isCompleted}
          role={role}
        />
      )}
    </div>
  );
}

/* =======================
   Review Modal Component
======================= */
function ReviewModal({
  selectedUser,
  setSelectedUser,
  remarks,
  setRemarks,
  expanded,
  setExpanded,
  loadingEmployee,
  employeeData,
  handleVerifySection,
  handleCompleteOnboarding,
  allSectionsVerified,
  isCompleted,
  role,
}) {
  const emp = employeeData?.data?.employee;

  const [confirmReject, setConfirmReject] = useState({
    open: false,
    sectionKey: null,
    data: null,
  });

  const sections = [
    {
      key: "personalInfo",
      title: "Personal Information",
      data: emp?.personalInfo,
      excludeKeys: [
        "isVerified",
        "address",
        "permanentAddress",
        "emergencyContact",
      ],
    },
    {
      key: "address",
      title: "Current Address",
      data: emp?.personalInfo?.address,
      excludeKeys: ["isVerified"],
    },
    {
      key: "permanentAddress",
      title: "Permanent Address",
      data: emp?.personalInfo?.permanentAddress,
      excludeKeys: ["isVerified"],
    },
    {
      key: "emergencyContact",
      title: "Emergency Contact",
      data: emp?.personalInfo?.emergencyContact,
      excludeKeys: ["isVerified"],
    },
    {
      key: "bankDetails",
      title: "Bank Details",
      data: emp?.companyInfo?.bankDetails,
      excludeKeys: ["isVerified"],
    },
    {
      key: "education",
      title: "Education",
      data: emp?.education,
    },
    {
      key: "experience",
      title: "Experience",
      data: emp?.experience,
    },
    {
      key: "documents",
      title: "Documents",
      data: emp?.documents,
    },
  ];

  // --- Icons ---
  const getStatusIcon = (data) => {
    if (Array.isArray(data)) {
      const allVerified = data.every((d) => d?.isVerified);
      const anyRejected = data.some((d) => d?.remarks && !d?.isVerified);
      if (allVerified)
        return <CheckCircle size={18} className="text-green-500" />;
      if (anyRejected) return <XCircle size={18} className="text-red-500" />;
      return <Clock size={18} className="text-gray-400 opacity-80" />;
    } else {
      if (data?.isVerified)
        return <CheckCircle size={18} className="text-green-500" />;
      if (data?.remarks && !data?.isVerified)
        return <XCircle size={18} className="text-red-500" />;
      return <Clock size={18} className="text-gray-400 opacity-80" />;
    }
  };

  if (!emp)
    return (
      <div className="fixed inset-0 bg-black/60 flex justify-center items-center text-white">
        <div className="bg-[#1a1a1a] p-6 rounded-lg">
          No employee data found.
        </div>
      </div>
    );

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 px-2">
      <div className="bg-[#121212] border border-[#333] rounded-2xl p-5 w-full max-w-5xl h-[90vh] overflow-y-auto shadow-xl relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-[#121212] pb-3 border-b border-[#333] z-10">
          <h2 className="text-xl font-semibold text-[#FFD700] flex items-center gap-2">
            Reviewing:{" "}
            <span className="text-white">{selectedUser.fullName}</span>
          </h2>
          <button
            onClick={() => {
              setSelectedUser(null);
              setRemarks({});
              setExpanded(null);
            }}
            className="text-gray-400 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        {loadingEmployee ? (
          <div className="flex justify-center items-center h-40 text-gray-400">
            <Loader2 size={20} className="animate-spin mr-2" /> Loading employee
            data...
          </div>
        ) : (
          <>
            {sections.map(({ key, title, data, excludeKeys = [] }) => {
              const isExpanded = expanded === key;
              const verified = Array.isArray(data)
                ? data?.every((d) => d?.isVerified)
                : data?.isVerified;
              const hasRemark = !!remarks[key];

              const isArrayData = Array.isArray(data);
              const isEmpty =
                !data ||
                (isArrayData && data.length === 0 && key !== "experience");

              return (
                <div
                  key={key}
                  className={`bg-[#1a1a1a] border rounded-lg mb-4 transition ${
                    verified
                      ? "border-green-700/70"
                      : data?.remarks
                      ? "border-red-700/70"
                      : "border-[#2a2a2a]"
                  }`}
                >
                  {/* Header */}
                  <div
                    className="flex justify-between items-center px-4 py-3 cursor-pointer"
                    onClick={() =>
                      setExpanded((prev) => (prev === key ? null : key))
                    }
                  >
                    <h3 className="font-semibold text-[#FFD700]">{title}</h3>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(data)}
                      {isExpanded ? (
                        <ChevronUp size={18} className="text-gray-400" />
                      ) : (
                        <ChevronDown size={18} className="text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Section Content */}
                  {isExpanded && (
                    <div className="px-5 pb-5 text-sm text-gray-300 space-y-2">
                      {/* --- EMPTY / ARRAY / OBJECT HANDLING --- */}
                      {isEmpty ? (
                        <p className="text-gray-500 italic">
                          {key === "experience"
                            ? "Not Applicable (Fresher)"
                            : "No data provided."}
                        </p>
                      ) : isArrayData ? (
                        data.map((item, i) => (
                          <div
                            key={i}
                            className="border border-[#333] rounded-lg p-3 mb-2"
                          >
                            {/* Documents special rendering */}
                            {key === "documents"
                              ? Object.entries(item)
                                  .filter(
                                    ([k]) =>
                                      ![
                                        "isverified",
                                        "verifiedat",
                                        "verifiedby",
                                        "remarks",
                                        "_id",
                                        "expirydate",
                                        "uploadedat",
                                        "documentnumber"
                                      ].some((ex) =>
                                        k.toLowerCase().includes(ex)
                                      )
                                  )

                                  .map(([k, v]) => (
                                    <p key={k}>
                                      <b className="capitalize">{k}:</b>{" "}
                                      {k === "url" && v ? (
                                        <a
                                          href={v}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-[#FFD700] hover:underline"
                                        >
                                          View Document
                                        </a>
                                      ) : (
                                        v || "N/A"
                                      )}
                                    </p>
                                  ))
                              : Object.entries(item)
                                  .filter(
                                    ([k]) =>
                                      ![
                                        "isverified",
                                        "verifiedat",
                                        "verifiedby",
                                        "remarks",
                                        "_id",
                                      ].some((ex) =>
                                        k.toLowerCase().includes(ex)
                                      )
                                  )

                                  .map(([k, v]) => (
                                    <p key={k}>
                                      <b className="capitalize">{k}:</b>{" "}
                                      {v ? String(v) : "N/A"}
                                    </p>
                                  ))}
                          </div>
                        ))
                      ) : (
                        Object.entries(data)
                          .filter(
                            ([k]) =>
                              !excludeKeys.includes(k) &&
                              ![
                                "isverified",
                                "verifiedat",
                                "verifiedby",
                                "remarks",
                                "_id",
                              ].some((ex) => k.toLowerCase().includes(ex))
                          )
                          .map(([k, v]) => (
                            <p key={k}>
                              <b className="capitalize">{k}:</b>{" "}
                              {v ? String(v) : "N/A"}
                            </p>
                          ))
                      )}

                      {/* --- Remarks + Actions --- */}
                      {!verified && (
                        <div className="mt-3 space-y-3">
                          {remarks[key] !== undefined && (
                            <textarea
                              placeholder="Enter remarks for rejection..."
                              value={remarks[key]}
                              onChange={(e) =>
                                setRemarks((prev) => ({
                                  ...prev,
                                  [key]: e.target.value,
                                }))
                              }
                              className="w-full bg-[#0d0d0d] border border-[#FFD700]/40 rounded-lg p-2 text-white focus:border-[#FFD700] outline-none placeholder-gray-400"
                            />
                          )}

                          <div className="flex flex-wrap gap-3">
                            {/* Verify button disabled if textarea open */}
                            <button
                              onClick={() =>
                                handleVerifySection(key, data, key)
                              }
                              disabled={remarks[key] !== undefined}
                              className={`px-4 py-2 rounded-md font-semibold transition ${
                                remarks[key] !== undefined
                                  ? "bg-gray-600 cursor-not-allowed text-gray-300"
                                  : "bg-[#FFD700] text-black hover:bg-[#ffe55c]"
                              }`}
                            >
                              Verify
                            </button>

                            {/* Reject logic */}
                            <button
                              onClick={() => {
                                if (remarks[key] === undefined) {
                                  // open textarea
                                  setRemarks((prev) => ({
                                    ...prev,
                                    [key]: "",
                                  }));
                                } else if (remarks[key].trim() === "") {
                                  toast.warn(
                                    "Please enter remarks before rejecting."
                                  );
                                } else if (
                                  setConfirmReject({
                                    open: true,
                                    sectionKey: key,
                                    data,
                                  })
                                ) {
                                  handleVerifySection(key, data, key);
                                }
                              }}
                              className={`px-4 py-2 rounded-md font-semibold transition ${
                                remarks[key] === undefined
                                  ? "bg-red-600 hover:bg-red-700 text-white"
                                  : "bg-red-600 hover:bg-red-700 text-white"
                              }`}
                            >
                              {remarks[key] === undefined
                                ? "Reject"
                                : "Confirm Reject"}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Completion Button */}
            {["hr", "admin"].includes(role) && (
              <div className="mt-6 sticky bottom-0 bg-[#121212] border-t border-[#333] pt-4">
                <button
                  disabled={!allSectionsVerified || isCompleted}
                  onClick={handleCompleteOnboarding}
                  className={`w-full py-3 rounded-lg font-semibold transition ${
                    !allSectionsVerified || isCompleted
                      ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                      : "bg-[#FFD700] text-black hover:bg-[#ffe55c]"
                  }`}
                >
                  {isCompleted ? "Onboarding Completed" : "Mark as Completed"}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {confirmReject.open && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[100]">
    <div className="bg-[#1a1a1a] border border-[#FFD700]/30 rounded-xl p-6 w-[90%] sm:w-[400px] text-center">
      <h3 className="text-lg font-semibold text-[#FFD700] mb-3">
        Confirm Rejection
      </h3>
      <p className="text-gray-300 mb-5">
        Are you sure you want to reject this section?
      </p>
      <div className="flex justify-center gap-4">
        <button
          onClick={() => {
            handleVerifySection(
              confirmReject.sectionKey,
              confirmReject.data,
              confirmReject.sectionKey
            );
            setConfirmReject({ open: false, sectionKey: null, data: null });
          }}
          className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold"
        >
          Yes, Reject
        </button>
        <button
          onClick={() =>
            setConfirmReject({ open: false, sectionKey: null, data: null })
          }
          className="px-5 py-2 bg-[#333] hover:bg-[#444] text-gray-200 rounded-lg font-semibold"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
