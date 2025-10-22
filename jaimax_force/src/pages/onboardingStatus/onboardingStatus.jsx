import {
  Banknote,
  BookOpen,
  Briefcase,
  CheckCircle,
  Clock,
  Edit3,
  FileText,
  Home,
  PhoneCall,
  User,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useUpdateRejectedSectionMutation } from "../../features/onboarding/onboardingApiSlice";
import { useGetProfileQuery } from "../../features/profile/profileApiSlice";
import { useSelector } from "react-redux";

export default function OnboardingStatus() {
  // const { data, isLoading, isError } = useGetProfileQuery();
  const profile = useSelector((state)=> state.profile.data);
  const isLoading = !profile;
  const [updateRejectedSection, { isLoading: isSubmitting }] =
    useUpdateRejectedSectionMutation();

  // const profile = data?.data || {};
  const employeeId = profile?.employeeId;

  const [editingStep, setEditingStep] = useState(null);
  const [formData, setFormData] = useState({});
  const [showModal, setShowModal] = useState(false);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-full text-gray-400">
        Loading onboarding details...
      </div>
    );

  if (!profile)
    return (
      <div className="flex justify-center items-center h-full text-red-400">
        Failed to load onboarding submited data.
      </div>
    );

  // Get section data from profile
  const getSectionData = (key) => {
    switch (key) {
      case "personal_info":
        return profile.personalInfo;
      case "address":
        return profile.personalInfo?.address;
      case "permanentAddress":
        return profile.personalInfo?.permanentAddress;
      case "emergency_contact":
        return profile.personalInfo?.emergencyContact;
      case "bank_details":
        return profile.companyInfo?.bankDetails;
      case "education":
        return profile.education?.[0];
      case "experience":
        return profile.experience?.[0];
      case "documents":
        return profile.documents?.[0];
      default:
        return {};
    }
  };

  const handleEditStep = (key) => {
    setEditingStep(key);
    setFormData(getSectionData(key) || {});
    setShowModal(true);
  };

  const handleChange = (field, value, subfield) => {
    if (subfield) {
      setFormData((prev) => ({
        ...prev,
        [field]: { ...prev[field], [subfield]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

 const handleSubmit = async () => {
  try {
    let payload;

    if (editingStep === "experience") {
      payload = { data: [formData] };
    } else {
      payload = { data: formData };
    }

    const res = await updateRejectedSection({
      employeeId,
      section: editingStep,
      payload,
    }).unwrap();

    toast.success(res?.message || "Section updated successfully!");
    setShowModal(false);
  } catch (err) {
    toast.error(err?.data?.message || "Update failed");
  }
};


  // --- Updated status render logic ---
  const renderStatus = (section) => {
    const isVerified = section?.isVerified || false;
    const remark = section?.remarks || "";
    const isRejected = !isVerified && remark.trim() !== "";

    // console.log(
    //   "isVerified",
    //   isVerified,
    //   "isRejected",
    //   isRejected,
    //   "remark",
    //   remark
    // );

    if (isRejected) {
      return (
        <div className="flex items-center gap-2 text-red-400">
          <XCircle size={18} /> Rejected
        </div>
      );
    }
    if (isVerified) {
      return (
        <div className="flex items-center gap-2 text-green-400">
          <CheckCircle size={18} /> Verified
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 text-yellow-400">
        <Clock size={18} /> Pending
      </div>
    );
  };

  const steps = [
    { key: "personal_info", title: "Personal Info", icon: <User size={20} /> },
    { key: "address", title: "Address", icon: <Home size={20} /> },
    {
      key: "permanentAddress",
      title: "permanentAddress",
      icon: <Home size={20} />,
    },
    {
      key: "emergency_contact",
      title: "Emergency Contact",
      icon: <PhoneCall size={20} />,
    },
    {
      key: "bank_details",
      title: "Bank Details",
      icon: <Banknote size={20} />,
    },
    { key: "education", title: "Education", icon: <BookOpen size={20} /> },
    { key: "experience", title: "Experience", icon: <Briefcase size={20} /> },
    { key: "documents", title: "Documents", icon: <FileText size={20} /> },
  ];

  return (
    <div className="flex flex-col flex-1 overflow-y-auto bg-[#0f0f0f] text-white px-4 sm:px-6 md:px-8 py-6 md:py-8">
      <ToastContainer />
      <h1 className="text-xl sm:text-2xl font-bold mb-6 text-[#FFD700] flex items-center gap-2">
        <User size={22} className="sm:size-24" /> Onboarding Progress
      </h1>

      {steps.map(({ key, title, icon }, i) => {
        const section = getSectionData(key);
        const isVerified = section?.isVerified || false;
        const remark = section?.remarks || "";
        const isRejected = !isVerified && remark.trim() !== "";
        const editable = !isVerified && remark.trim() !== "";

        return (
          <div
            key={key}
            className={`bg-[#1a1a1a] border ${
              editable ? "border-yellow-600/40" : "border-green-600/40"
            } rounded-xl p-4 sm:p-6 mb-6 shadow-sm`}
          >
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-3 gap-2 sm:gap-0">
              <div className="flex items-center gap-2 sm:gap-3">
                {icon}
                <h2 className="text-base sm:text-lg font-semibold">
                  {i + 1}. {title}
                </h2>
              </div>
              {renderStatus(section)}
            </div>

            <div className="space-y-1 text-xs sm:text-sm text-gray-300 break-words">
              {/* Personal Info */}
              {key === "personal_info" && (
                <>
                  <p>
                    <b>Name:</b> {section?.firstName} {section?.lastName}
                  </p>
                  <p>
                    <b>Email:</b> {section?.email}
                  </p>
                  <p>
                    <b>Phone:</b> {section?.phone}
                  </p>
                  <p>
                    <b>Gender:</b> {section?.gender}
                  </p>
                  <p>
                    <b>Blood Group:</b> {section?.bloodGroup}
                  </p>
                  <p>
                    <b>Marital Status:</b> {section?.maritalStatus}
                  </p>
                  {/* --- Verification Metadata --- */}
                  {(isRejected || remark) && (
                    <div className="mt-3 text-sm border-t border-[#333] pt-3 space-y-1 text-gray-400">
                      {/* {isRejected && (
                        <p className="text-red-400 font-medium">
                          <b>Rejected By:</b>{" "}
                          {section?.verifiedBy
                            ? // ? `${section.verifiedBy.personalInfo.firstName} ${section.verifiedBy.personalInfo.lastName}`
                              section.verifiedBy
                            : "N/A"}
                        </p>
                      )} */}
                      {isRejected && section?.verifiedAt && (
                        <p>
                          <b>Verified At:</b>{" "}
                          {new Date(section.verifiedAt).toLocaleString("en-IN")}
                        </p>
                      )}
                      {remark && (
                        <p className="text-red-400 italic">
                          <b>Remarks:</b> {remark}
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* Address */}
              {key === "address" && (
                <>
                  <p>
                    <b>Street:</b> {section.street}
                  </p>
                  <p>
                    <b>City:</b> {section.city}
                  </p>
                  <p>
                    <b>State:</b> {section.state}
                  </p>
                  <p>
                    <b>Country:</b> {section.country}
                  </p>
                  {/* --- Verification Metadata --- */}
                  {(isRejected || remark) && (
                    <div className="mt-3 text-sm border-t border-[#333] pt-3 space-y-1 text-gray-400">
                      {/* {isRejected && (
                        <p className="text-red-400 font-medium">
                          <b>Rejected By:</b>{" "}
                          {section?.verifiedBy?.personalInfo
                            ? `${section.verifiedBy.personalInfo.firstName} ${section.verifiedBy.personalInfo.lastName}`
                            : "N/A"}
                        </p>
                      )} */}
                      {isRejected && section?.verifiedAt && (
                        <p>
                          <b>Verified At:</b>{" "}
                          {new Date(section.verifiedAt).toLocaleString("en-IN")}
                        </p>
                      )}
                      {remark && (
                        <p className="text-red-400 italic">
                          <b>Remarks:</b> {remark}
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* Address */}
              {key === "permanentAddress" && (
                <>
                  <p>
                    <b>Street:</b> {section.street}
                  </p>
                  <p>
                    <b>City:</b> {section.city}
                  </p>
                  <p>
                    <b>State:</b> {section.state}
                  </p>
                  <p>
                    <b>Country:</b> {section.country}
                  </p>
                  {/* --- Verification Metadata --- */}
                  {(isRejected || remark) && (
                    <div className="mt-3 text-sm border-t border-[#333] pt-3 space-y-1 text-gray-400">
                      {/* {isRejected && (
                        <p className="text-red-400 font-medium">
                          <b>Rejected By:</b>{" "}
                          {section?.verifiedBy?.personalInfo
                            ? `${section.verifiedBy.personalInfo.firstName} ${section.verifiedBy.personalInfo.lastName}`
                            : "N/A"}
                        </p>
                      )} */}
                      {isRejected && section?.verifiedAt && (
                        <p>
                          <b>Verified At:</b>{" "}
                          {new Date(section.verifiedAt).toLocaleString("en-IN")}
                        </p>
                      )}
                      {remark && (
                        <p className="text-red-400 italic">
                          <b>Remarks:</b> {remark}
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* Emergency Contact */}
              {key === "emergency_contact" && (
                <>
                  <p>
                    <b>Name:</b> {section?.name}
                  </p>
                  <p>
                    <b>Relationship:</b> {section?.relationship}
                  </p>
                  <p>
                    <b>Phone:</b> {section?.phone}
                  </p>
                  {/* --- Verification Metadata --- */}
                  {(isRejected || remark) && (
                    <div className="mt-3 text-sm border-t border-[#333] pt-3 space-y-1 text-gray-400">
                      {/* {isRejected && (
                        <p className="text-red-400 font-medium">
                          <b>Rejected By:</b>{" "}
                          {section?.verifiedBy?.personalInfo
                            ? `${section.verifiedBy.personalInfo.firstName} ${section.verifiedBy.personalInfo.lastName}`
                            : "N/A"}
                        </p>
                      )} */}
                      {isRejected && section?.verifiedAt && (
                        <p>
                          <b>Verified At:</b>{" "}
                          {new Date(section.verifiedAt).toLocaleString("en-IN")}
                        </p>
                      )}
                      {remark && (
                        <p className="text-red-400 italic">
                          <b>Remarks:</b> {remark}
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* Bank Details */}
              {key === "bank_details" && (
                <>
                  <p>
                    <b>Account Holder:</b> {section?.accountHolderName}
                  </p>
                  <p>
                    <b>Bank:</b> {section?.bankName}
                  </p>
                  <p>
                    <b>Account No:</b> {section?.accountNumber}
                  </p>
                  <p>
                    <b>IFSC:</b> {section?.ifscCode}
                  </p>
                  {/* --- Verification Metadata --- */}
                  {(isRejected || remark) && (
                    <div className="mt-3 text-sm border-t border-[#333] pt-3 space-y-1 text-gray-400">
                      {/* {isRejected && (
                        <p className="text-red-400 font-medium">
                          <b>Rejected By:</b>{" "}
                          {section?.verifiedBy?.personalInfo
                            ? `${section.verifiedBy.personalInfo.firstName} ${section.verifiedBy.personalInfo.lastName}`
                            : "N/A"}
                        </p>
                      )} */}
                      {isRejected && section?.verifiedAt && (
                        <p>
                          <b>Verified At:</b>{" "}
                          {new Date(section.verifiedAt).toLocaleString("en-IN")}
                        </p>
                      )}
                      {remark && (
                        <p className="text-red-400 italic">
                          <b>Remarks:</b> {remark}
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* Education */}
              {key === "education" && Array.isArray(profile.education) && (
                <div className="space-y-3">
                  {profile.education.map((edu, idx) => {
                    const isRejected =
                      !edu.isVerified && edu.remarks?.trim() !== "";
                    const remark = edu.remarks?.trim();

                    return (
                      <div
                        key={idx}
                        className={`border-l-4 pl-3 pb-3 ${
                          edu.isVerified
                            ? "border-green-600/70"
                            : isRejected
                            ? "border-red-600/70"
                            : "border-yellow-600/70"
                        }`}
                      >
                        <p>
                          <b>Degree:</b> {edu.degree || "N/A"}
                        </p>
                        <p>
                          <b>Institution:</b> {edu.institution || "N/A"}
                        </p>
                        <p>
                          <b>Grade:</b> {edu.grade || "N/A"}
                        </p>
                        <p>
                          <b>Start Date:</b>{" "}
                          {edu.startDate
                            ? new Date(edu.startDate).toLocaleDateString(
                                "en-IN"
                              )
                            : "N/A"}
                        </p>
                        <p>
                          <b>End Date:</b>{" "}
                          {edu.endDate
                            ? new Date(edu.endDate).toLocaleDateString("en-IN")
                            : "N/A"}
                        </p>

                        {/* --- Verification Metadata --- */}
                        {(isRejected || remark) && (
                          <div className="mt-3 text-sm border-t border-[#333] pt-3 space-y-1 text-gray-400">
                            {/* {isRejected && (
                              <p className="text-red-400 font-medium">
                                <b>Rejected By:</b>{" "}
                                {edu?.verifiedBy?.personalInfo
                                  ? `${edu.verifiedBy.personalInfo.firstName} ${edu.verifiedBy.personalInfo.lastName}`
                                  : "N/A"}
                              </p>
                            )} */}
                            {edu?.verifiedAt && (
                              <p>
                                <b>Verified At:</b>{" "}
                                {new Date(edu.verifiedAt).toLocaleString(
                                  "en-IN"
                                )}
                              </p>
                            )}
                            {remark && (
                              <p className="text-red-400 italic">
                                <b>Remarks:</b> {remark}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Experience */}
              {key === "experience" && Array.isArray(profile.experience) && (
                <div className="space-y-3">
                  {profile.experience.map((exp, idx) => {
                    const isRejected =
                      !exp.isVerified && exp.remarks?.trim() !== "";
                    const remark = exp.remarks?.trim();

                    return (
                      <div
                        key={idx}
                        className={`border-l-4 pl-3 pb-3 ${
                          exp.isVerified
                            ? "border-green-600/70"
                            : isRejected
                            ? "border-red-600/70"
                            : "border-yellow-600/70"
                        }`}
                      >
                        <p>
                          <b>Company:</b> {exp.company || "N/A"}
                        </p>
                        <p>
                          <b>Start Date:</b>{" "}
                          {exp.startDate
                            ? new Date(exp.startDate).toLocaleDateString(
                                "en-IN"
                              )
                            : "N/A"}
                        </p>
                        <p>
                          <b>End Date:</b>{" "}
                          {exp.endDate
                            ? new Date(exp.endDate).toLocaleDateString("en-IN")
                            : "N/A"}
                        </p>

                        {/* --- Verification Metadata --- */}
                        {(isRejected || remark) && (
                          <div className="mt-3 text-sm border-t border-[#333] pt-3 space-y-1 text-gray-400">
                            {/* {isRejected && (
                              <p className="text-red-400 font-medium">
                                <b>Rejected By:</b>{" "}
                                {exp?.verifiedBy?.personalInfo
                                  ? `${exp.verifiedBy.personalInfo.firstName} ${exp.verifiedBy.personalInfo.lastName}`
                                  : "N/A"}
                              </p>
                            )} */}
                            {exp?.verifiedAt && (
                              <p>
                                <b>Verified At:</b>{" "}
                                {new Date(exp.verifiedAt).toLocaleString(
                                  "en-IN"
                                )}
                              </p>
                            )}
                            {remark && (
                              <p className="text-red-400 italic">
                                <b>Remarks:</b> {remark}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Documents */}
              {key === "documents" && (
                <>
                  <p>
                    <b>Document Name:</b> {section?.name}
                  </p>
                  <p>
                    <b>Type:</b> {section?.type}
                  </p>
                  {/* --- Verification Metadata --- */}
                  {(isRejected || remark) && (
                    <div className="mt-3 text-sm border-t border-[#333] pt-3 space-y-1 text-gray-400">
                      {/* {isRejected && (
                        <p className="text-red-400 font-medium">
                          <b>Rejected By:</b>{" "}
                          {section?.verifiedBy?.personalInfo
                            ? `${section.verifiedBy.personalInfo.firstName} ${section.verifiedBy.personalInfo.lastName}`
                            : "N/A"}
                        </p>
                      )} */}
                      {isRejected && section?.verifiedAt && (
                        <p>
                          <b>Verified At:</b>{" "}
                          {new Date(section.verifiedAt).toLocaleString("en-IN")}
                        </p>
                      )}
                      {remark && (
                        <p className="text-red-400 italic">
                          <b>Remarks:</b> {remark}
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {editable && (
              <button
                onClick={() => handleEditStep(key)}
                className="mt-4 w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-[#FFD700] to-[#ffffff] text-black font-semibold rounded-full hover:scale-105 transition flex items-center justify-center sm:justify-start gap-2 text-sm sm:text-base"
              >
                <Edit3 size={16} /> Edit & Resubmit
              </button>
            )}
          </div>
        );
      })}

      {/* --- Modal --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 px-4 sm:px-6">
          <div className="bg-[#1a1a1a] border border-[#333] rounded-2xl p-4 sm:p-6 w-full max-w-lg sm:max-w-2xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-lg sm:text-xl font-semibold text-[#FFD700] mb-6 capitalize text-center sm:text-left">
              Edit & Resubmit — {editingStep.replace("_", " ")}
            </h2>

            {/* === PERSONAL INFO === */}
            {editingStep === "personal_info" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName || ""}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                    className="w-full bg-[#0d0d0d] border border-[#333] rounded-lg p-3 text-white focus:border-[#FFD700] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName || ""}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                    className="w-full bg-[#0d0d0d] border border-[#333] rounded-lg p-3 text-white focus:border-[#FFD700] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="w-full bg-[#0d0d0d] border border-[#333] rounded-lg p-3 text-white focus:border-[#FFD700] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Phone
                    </label>
                    <input
                      type="text"
                      value={formData.phone || ""}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      className="w-full bg-[#0d0d0d] border border-[#333] rounded-lg p-3 text-white focus:border-[#FFD700] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Gender
                    </label>
                    <select
                      value={formData.gender || ""}
                      onChange={(e) => handleChange("gender", e.target.value)}
                      className="w-full bg-[#0d0d0d] border border-[#333] rounded-lg p-3 text-white focus:border-[#FFD700] outline-none"
                    >
                      <option value="">Select</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Blood Group
                    </label>
                    <input
                      type="text"
                      value={formData.bloodGroup || ""}
                      onChange={(e) =>
                        handleChange("bloodGroup", e.target.value)
                      }
                      className="w-full bg-[#0d0d0d] border border-[#333] rounded-lg p-3 text-white focus:border-[#FFD700] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Marital Status
                    </label>
                    <input
                      type="text"
                      value={formData.maritalStatus || ""}
                      onChange={(e) =>
                        handleChange("maritalStatus", e.target.value)
                      }
                      className="w-full bg-[#0d0d0d] border border-[#333] rounded-lg p-3 text-white focus:border-[#FFD700] outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* === ADDRESS === */}
            {editingStep === "address" && (
              <div className="space-y-4">
                <h3 className="text-[#FFD700] font-semibold">
                  Current Address
                </h3>
                {["street", "city", "state", "pincode", "country"].map((f) => (
                  <div key={f}>
                    <label className="block text-sm text-gray-300 mb-1 capitalize">
                      {f}
                    </label>
                    <input
                      value={formData.address?.[f] || ""}
                      onChange={(e) =>
                        handleChange("address", e.target.value, f)
                      }
                      className="w-full bg-[#0d0d0d] border border-[#333] rounded-lg p-3 text-white focus:border-[#FFD700] outline-none"
                    />
                  </div>
                ))}

                <h3 className="text-[#FFD700] font-semibold mt-4">
                  Permanent Address
                </h3>
                {["street", "city", "state", "pincode", "country"].map((f) => (
                  <div key={f}>
                    <label className="block text-sm text-gray-300 mb-1 capitalize">
                      {f}
                    </label>
                    <input
                      value={formData.permanentAddress?.[f] || ""}
                      onChange={(e) =>
                        handleChange("permanentAddress", e.target.value, f)
                      }
                      className="w-full bg-[#0d0d0d] border border-[#333] rounded-lg p-3 text-white focus:border-[#FFD700] outline-none"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* === EMERGENCY CONTACT === */}
            {editingStep === "emergency_contact" && (
              <div className="space-y-4">
                {["name", "relationship", "phone", "alternatePhone"].map(
                  (f) => (
                    <div key={f}>
                      <label className="block text-sm text-gray-300 mb-1 capitalize">
                        {f.replace("alternatePhone", "Alternate Phone")}
                      </label>
                      <input
                        value={formData?.[f] || ""}
                        onChange={(e) => handleChange(f, e.target.value)}
                        className="w-full bg-[#0d0d0d] border border-[#333] rounded-lg p-3 text-white focus:border-[#FFD700] outline-none"
                      />
                    </div>
                  )
                )}
              </div>
            )}

            {/* === BANK DETAILS === */}
            {editingStep === "bank_details" && (
              <div className="space-y-4">
                {[
                  "accountHolderName",
                  "accountNumber",
                  "bankName",
                  "branchName",
                  "ifscCode",
                  "accountType",
                ].map((f) => (
                  <div key={f}>
                    <label className="block text-sm text-gray-300 mb-1 capitalize">
                      {f.replace(/([A-Z])/g, " $1")}
                    </label>
                    <input
                      value={formData?.[f] || ""}
                      onChange={(e) => handleChange(f, e.target.value)}
                      className="w-full bg-[#0d0d0d] border border-[#333] rounded-lg p-3 text-white focus:border-[#FFD700] outline-none"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* === EDUCATION === */}
            {editingStep === "education" && (
              <div className="space-y-4">
                <label className="block text-sm text-gray-300 mb-1">
                  Degree / Qualification
                </label>
                <input
                  value={formData.degree || ""}
                  onChange={(e) => handleChange("degree", e.target.value)}
                  className="w-full bg-[#0d0d0d] border border-[#333] rounded-lg p-3 text-white focus:border-[#FFD700] outline-none"
                />

                <label className="block text-sm text-gray-300 mb-1">
                  Institution Name
                </label>
                <input
                  value={formData.institution || ""}
                  onChange={(e) => handleChange("institution", e.target.value)}
                  className="w-full bg-[#0d0d0d] border border-[#333] rounded-lg p-3 text-white focus:border-[#FFD700] outline-none"
                />
              </div>
            )}

            {/* === EXPERIENCE === */}
            {editingStep === "experience" && (
              <div className="space-y-4">
                <label className="block text-sm text-gray-300 mb-1">
                  Company Name
                </label>
                <input
                  value={formData.company || ""}
                  onChange={(e) => handleChange("company", e.target.value)}
                  className="w-full bg-[#0d0d0d] border border-[#333] rounded-lg p-3 text-white focus:border-[#FFD700] outline-none"
                />
                <label className="block text-sm text-gray-300 mb-1">
                  Designation
                </label>
                <input
                  value={formData.designation || ""}
                  onChange={(e) => handleChange("designation", e.target.value)}
                  className="w-full bg-[#0d0d0d] border border-[#333] rounded-lg p-3 text-white focus:border-[#FFD700] outline-none"
                />
              </div>
            )}

            {/* === DOCUMENTS === */}
            {editingStep === "documents" && (
              <div className="space-y-4">
                <label className="block text-sm text-gray-300 mb-1">
                  Doc Type
                </label>
                <input
                  value={formData.type || ""}
                  onChange={(e) => handleChange("type", e.target.value)}
                  className="w-full bg-[#0d0d0d] border border-[#333] rounded-lg p-3 text-white focus:border-[#FFD700] outline-none"
                />
                <label className="block text-sm text-gray-300 mb-1">
                  Doc Name
                </label>
                <input
                  value={formData.name || ""}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="w-full bg-[#0d0d0d] border border-[#333] rounded-lg p-3 text-white focus:border-[#FFD700] outline-none"
                />
                <label className="block text-sm text-gray-300 mb-1">
                  Document Number
                </label>
                <input
                  value={formData.documentNumber || ""}
                  onChange={(e) =>
                    handleChange("documentNumber", e.target.value)
                  }
                  className="w-full bg-[#0d0d0d] border border-[#333] rounded-lg p-3 text-white focus:border-[#FFD700] outline-none"
                />
              </div>
            )}

            {/* --- Buttons --- */}
            <div className="flex flex-col-reverse sm:flex-row justify-end sm:justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition text-sm sm:text-base w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#FFD700] to-[#ffffff] text-black font-semibold hover:scale-105 transition text-sm sm:text-base w-full sm:w-auto"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
