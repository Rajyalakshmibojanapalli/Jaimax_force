import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { AlertTriangle, Plus, Minus } from "lucide-react";
import { useGetEmployeeByIdQuery } from "../../features/onboarding/onboardingApiSlice";
import { useUpdateEmployeeMutation } from "../../features/hrAccess/hrApiSlice";

/* --------------------- helpers --------------------- */
const setDeep = (obj, path, value) => {
  const keys = path.split(".");
  const clone = Array.isArray(obj) ? [...obj] : { ...obj };
  let cur = clone;
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    cur[k] = cur[k]
      ? Array.isArray(cur[k])
        ? [...cur[k]]
        : { ...cur[k] }
      : {};
    cur = cur[k];
  }
  cur[keys[keys.length - 1]] = value;
  return clone;
};

const isPathChanged = (editedData, originalData, path) => {
  const keys = path.split(".");

  const getValue = (obj) => {
    let cur = obj;
    for (const k of keys) {
      if (cur == null) return undefined;
      cur = cur[k];
    }
    return cur;
  };

  const originalValue = getValue(originalData);
  const editedValue = getValue(editedData);
  return editedValue !== undefined && editedValue !== originalValue;
};


/* --------------------- field components --------------------- */
const FieldRow = ({ label, value, onChange, changed }) => {
  const [editing, setEditing] = useState(false);
  const [temp, setTemp] = useState(value ?? "");

  useEffect(() => setTemp(value ?? ""), [value]);

  return (
    <div className="flex items-start justify-between border-b border-[#2a2a2a] py-2">
      <span className="text-gray-300 w-1/3">{label}</span>
      {editing ? (
        <input
          value={temp}
          onChange={(e) => setTemp(e.target.value)}
          onBlur={() => {
            onChange(temp);
            setEditing(false);
          }}
          className="bg-[#111] border border-[#333] text-gray-200 rounded-md px-2 py-1 w-[65%]"
          autoFocus
        />
      ) : (
        <span
          className={`w-[65%] text-right cursor-pointer ${
            changed ? "text-[#18a04a]" : "text-gray-400"
          }`}
          onClick={() => setEditing(true)}
        >
          {value ?? "—"}
        </span>
      )}
    </div>
  );
};

/* --------------------- confirmation overlay --------------------- */
const ConfirmOverlay = ({ onConfirm, onCancel }) => (
  <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-xl">
    <div className="bg-[#1b1b1b] border border-[#FFD700]/40 rounded-xl p-6 w-[90%] max-w-md text-center shadow-xl">
      <h3 className="text-lg font-semibold text-[#FFD700] flex items-center justify-center gap-2 mb-3">
        <AlertTriangle size={18} /> Confirm Update
      </h3>
      <p className="text-gray-300 mb-6">
        Are you sure you want to{" "}
        <span className="text-[#FFD700] font-medium">
          update this employee’s details?
        </span>
      </p>
      <div className="flex justify-center gap-3">
        <button
          onClick={onCancel}
          className="px-5 py-2 border border-gray-500 text-gray-300 rounded-full hover:bg-[#222]"
        >
          No
        </button>
        <button
          onClick={onConfirm}
          className="px-6 py-2 bg-[#FFD700] to-[#ffffff] text-black font-semibold rounded-full"
        >
          Yes
        </button>
      </div>
    </div>
  </div>
);

/* --------------------- modal --------------------- */
export default function UpdateEmployeeModal({ employeeId, onClose, refetch }) {
  const { data, isFetching } = useGetEmployeeByIdQuery(employeeId);
  const employee = data?.data?.employee;
  const [updateEmployee] = useUpdateEmployeeMutation();

  const [draft, setDraft] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [activeTab, setActiveTab] = useState("personal");
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (employee) {
      setDraft(JSON.parse(JSON.stringify(employee)));
      setEditedData({});
    }
  }, [employee]);

  const onFieldChange = (path, value) => {
    setDraft((prev) => setDeep(prev, path, value));
    setEditedData((prev) => setDeep(prev, path, value));
  };

  // education
  const addEducation = () => {
    const next = [...(draft.education || []), { institution: "", degree: "" }];
    setDraft((prev) => ({ ...(prev || {}), education: next }));
    setEditedData((prev) => setDeep(prev, "education", next));
  };
  const removeEducation = (i) => {
    const next = draft.education.filter((_, idx) => idx !== i);
    setDraft((prev) => ({ ...(prev || {}), education: next }));
    setEditedData((prev) => setDeep(prev, "education", next));
  };

  // skills
  const addSkill = () => {
    const next = [...(draft.skills || []), ""];
    setDraft((prev) => ({ ...(prev || {}), skills: next }));
    setEditedData((prev) => setDeep(prev, "skills", next));
  };
  const removeSkill = (i) => {
    const next = draft.skills.filter((_, idx) => idx !== i);
    setDraft((prev) => ({ ...(prev || {}), skills: next }));
    setEditedData((prev) => setDeep(prev, "skills", next));
  };

  const tabs = [
    { key: "personal", label: "Personal Info" },
    { key: "address", label: "Address" },
    { key: "emergency", label: "Emergency Contact" },
    // { key: "company", label: "Company Info" },
    { key: "bank", label: "Bank Details" },
    { key: "education", label: "Education" },
    { key: "skills", label: "Skills" },
    // { key: "auth", label: "Authentication" },
  ];

  const tabAnim = {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.25 } },
    exit: { opacity: 0, x: -30, transition: { duration: 0.2 } },
  };

  const handleConfirmUpdate = async () => {
    if (Object.keys(editedData).length === 0) {
      toast.info("No changes made.");
      setShowConfirm(false);
      return;
    }
    try {
      const res = await updateEmployee({
        employeeId,
        updateData: editedData,
      }).unwrap();
      toast.success(res?.message || "Employee updated successfully!");
      refetch();
      setShowConfirm(false);
      onClose();
    } catch (err) {
      toast.error(err?.data?.message || "Update failed.");
    }
  };

  if (isFetching || !draft)
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
        <div className="text-gray-400">Loading employee details...</div>
      </div>
    );

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 overflow-y-auto">
      <div className="relative bg-[#1a1a1a] border border-[#FFD700]/30 rounded-xl p-6 w-[95%] max-w-5xl shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-[#FFD700]">
            Update Employee — {draft.fullName}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-sm border border-[#333] rounded-full px-3 py-1"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 overflow-x-auto pb-2 mb-3">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className="relative pb-2 text-sm whitespace-nowrap text-gray-300 hover:text-white"
            >
              {t.label}
              {activeTab === t.key && (
                <span className="absolute left-0 right-0 -bottom-0.5 h-0.5 bg-[#FFD700] rounded-full " />
              )}
            </button>
          ))}
        </div>

        <div className="border-b border-[#2a2a2a] mb-3" />

        {/* Section content */}
        <div className="max-h-[60vh] overflow-y-auto pr-1">
          <AnimatePresence mode="wait">
            {activeTab === "personal" && (
              <motion.div key="personal" {...tabAnim}>
                <FieldRow
                  label="First Name"
                  value={draft.personalInfo?.firstName}
                  onChange={(v) => onFieldChange("personalInfo.firstName", v)}
                  changed={isPathChanged(editedData, employee, "personalInfo.firstName")}
                />
                <FieldRow
                  label="Last Name"
                  value={draft.personalInfo?.lastName}
                  onChange={(v) => onFieldChange("personalInfo.lastName", v)}
                  changed={isPathChanged(editedData, employee, "personalInfo.lastName")}
                />
                <FieldRow
                  label="Phone"
                  value={draft.personalInfo?.phone}
                  onChange={(v) => onFieldChange("personalInfo.phone", v)}
                  changed={isPathChanged(editedData, employee, "personalInfo.phone")}
                />
                <FieldRow
                  label="Gender"
                  value={draft.personalInfo?.gender}
                  onChange={(v) => onFieldChange("personalInfo.gender", v)}
                  changed={isPathChanged(editedData, employee, "personalInfo.gender")}
                />
                <FieldRow
                  label="Email"
                  value={draft.personalInfo?.email}
                  onChange={(v) => onFieldChange("personalInfo.email", v)}
                  changed={isPathChanged(editedData, employee, "personalInfo.email")}
                />
                <FieldRow
                  label="Date of Birth"
                  value={draft.personalInfo?.dateOfBirth?.split("T")[0]}
                  onChange={(v) => onFieldChange("personalInfo.dateOfBirth", v)}
                  changed={isPathChanged(
                    editedData,
                    employee,
                    "personalInfo.dateOfBirth"
                  )}
                />
                <FieldRow
                  label="Blood Group"
                  value={draft.personalInfo?.bloodGroup}
                  onChange={(v) => onFieldChange("personalInfo.bloodGroup", v)}
                  changed={isPathChanged(editedData, employee, "personalInfo.bloodGroup")}
                />
                <FieldRow
                  label="Marital Status"
                  value={draft.personalInfo?.maritalStatus}
                  onChange={(v) =>
                    onFieldChange("personalInfo.maritalStatus", v)
                  }
                  changed={isPathChanged(
                    editedData,
                    employee,
                    "personalInfo.maritalStatus"
                  )}
                />
              </motion.div>
            )}
            {activeTab === "address" && (
  <motion.div key="address" {...tabAnim}>
    {/* Current Address */}
    <h4 className="text-[#FFD700] font-semibold mb-2">Current Address</h4>
    <FieldRow
      label="Street"
      value={draft.personalInfo?.address?.street}
      onChange={(v) => onFieldChange("personalInfo.address.street", v)}
      changed={isPathChanged(editedData, employee, "personalInfo.address.street")}
    />
    <FieldRow
      label="City"
      value={draft.personalInfo?.address?.city}
      onChange={(v) => onFieldChange("personalInfo.address.city", v)}
      changed={isPathChanged(editedData, employee, "personalInfo.address.city")}
    />
    <FieldRow
      label="State"
      value={draft.personalInfo?.address?.state}
      onChange={(v) => onFieldChange("personalInfo.address.state", v)}
      changed={isPathChanged(editedData, employee, "personalInfo.address.state")}
    />
    <FieldRow
      label="Country"
      value={draft.personalInfo?.address?.country}
      onChange={(v) => onFieldChange("personalInfo.address.country", v)}
      changed={isPathChanged(editedData, employee, "personalInfo.address.country")}
    />
    <FieldRow
      label="Pincode"
      value={draft.personalInfo?.address?.pincode}
      onChange={(v) => onFieldChange("personalInfo.address.pincode", v)}
      changed={isPathChanged(editedData, employee, "personalInfo.address.pincode")}
    />

    <div className="border-t border-[#2a2a2a] my-4" />

    {/* Permanent Address */}
    <h4 className="text-[#FFD700] font-semibold mb-2">Permanent Address</h4>
    <FieldRow
      label="Street"
      value={draft.personalInfo?.permanentAddress?.street}
      onChange={(v) => onFieldChange("personalInfo.permanentAddress.street", v)}
      changed={isPathChanged(editedData, employee, "personalInfo.permanentAddress.street")}
    />
    <FieldRow
      label="City"
      value={draft.personalInfo?.permanentAddress?.city}
      onChange={(v) => onFieldChange("personalInfo.permanentAddress.city", v)}
      changed={isPathChanged(editedData, employee, "personalInfo.permanentAddress.city")}
    />
    <FieldRow
      label="State"
      value={draft.personalInfo?.permanentAddress?.state}
      onChange={(v) => onFieldChange("personalInfo.permanentAddress.state", v)}
      changed={isPathChanged(editedData, employee, "personalInfo.permanentAddress.state")}
    />
    <FieldRow
      label="Country"
      value={draft.personalInfo?.permanentAddress?.country}
      onChange={(v) => onFieldChange("personalInfo.permanentAddress.country", v)}
      changed={isPathChanged(editedData, employee, "personalInfo.permanentAddress.country")}
    />
    <FieldRow
      label="Pincode"
      value={draft.personalInfo?.permanentAddress?.pincode}
      onChange={(v) => onFieldChange("personalInfo.permanentAddress.pincode", v)}
      changed={isPathChanged(editedData, employee, "personalInfo.permanentAddress.pincode")}
    />
  </motion.div>
)}

            {activeTab === "emergency" && (
              <motion.div key="personal" {...tabAnim}>
                <FieldRow
                  label="Name"
                  value={draft.personalInfo?.emergencyContact?.name}
                  onChange={(v) =>
                    onFieldChange("personalInfo.emergencyContact.name", v)
                  }
                  changed={isPathChanged(
                    editedData,
                    employee,
                    "personalInfo.emergencyContact.name"
                  )}
                />
                <FieldRow
                  label="Relationship"
                  value={draft.personalInfo?.emergencyContact?.relationship}
                  onChange={(v) =>
                    onFieldChange(
                      "personalInfo.emergencyContact.relationship",
                      v
                    )
                  }
                  changed={isPathChanged(
                    editedData,
                    employee,
                    "personalInfo.emergencyContact.relationship"
                  )}
                />
                <FieldRow
                  label="Phone"
                  value={draft.personalInfo?.emergencyContact?.phone}
                  onChange={(v) =>
                    onFieldChange("personalInfo.emergencyContact.phone", v)
                  }
                  changed={isPathChanged(
                    editedData,
                    employee,
                    "personalInfo.emergencyContact.phone"
                  )}
                />
                <FieldRow
                  label="Alternate Phone"
                  value={draft.personalInfo?.emergencyContact?.alternatePhone}
                  onChange={(v) =>
                    onFieldChange(
                      "personalInfo.emergencyContact.alternatePhone",
                      v
                    )
                  }
                  changed={isPathChanged(
                    editedData,
                    employee,
                    "personalInfo.emergencyContact.alternatePhone"
                  )}
                />
              </motion.div>
            )}

            {activeTab === "bank" && (
              <motion.div key="personal" {...tabAnim}>
                <FieldRow
                  label="Account Holder Name"
                  value={draft.companyInfo?.bankDetails?.accountHolderName}
                  onChange={(v) =>
                    onFieldChange(
                      "companyInfo.bankDetails.accountHolderName",
                      v
                    )
                  }
                  changed={isPathChanged(
                    editedData,
                    employee,
                    "companyInfo.bankDetails.accountHolderName"
                  )}
                />
                <FieldRow
                  label="Account Number"
                  value={draft.companyInfo?.bankDetails?.accountNumber}
                  onChange={(v) =>
                    onFieldChange("companyInfo.bankDetails.accountNumber", v)
                  }
                  changed={isPathChanged(
                    editedData,
                    employee,
                    "companyInfo.bankDetails.accountNumber"
                  )}
                />
                <FieldRow
                  label="Bank Name"
                  value={draft.companyInfo?.bankDetails?.bankName}
                  onChange={(v) =>
                    onFieldChange("companyInfo.bankDetails.bankName", v)
                  }
                  changed={isPathChanged(
                    editedData,
                    employee,
                    "companyInfo.bankDetails.bankName"
                  )}
                />
                <FieldRow
                  label="Branch Name"
                  value={draft.companyInfo?.bankDetails?.branchName}
                  onChange={(v) =>
                    onFieldChange("companyInfo.bankDetails.branchName", v)
                  }
                  changed={isPathChanged(
                    editedData,
                    employee,
                    "companyInfo.bankDetails.branchName"
                  )}
                />
                <FieldRow
                  label="IFSC Code"
                  value={draft.companyInfo?.bankDetails?.ifscCode}
                  onChange={(v) =>
                    onFieldChange("companyInfo.bankDetails.ifscCode", v)
                  }
                  changed={isPathChanged(
                    editedData,
                    employee,
                    "companyInfo.bankDetails.ifscCode"
                  )}
                />
                <FieldRow
                  label="Account Type"
                  value={draft.companyInfo?.bankDetails?.accountType}
                  onChange={(v) =>
                    onFieldChange("companyInfo.bankDetails.accountType", v)
                  }
                  changed={isPathChanged(
                    editedData,
                    employee,
                    "companyInfo.bankDetails.accountType"
                  )}
                />
              </motion.div>
            )}

            {activeTab === "education" && (
              <motion.div key="education" {...tabAnim}>
                <div className="flex justify-end mb-2">
                  <button
                    onClick={addEducation}
                    className="flex items-center gap-1 text-sm px-3 py-1 rounded-md bg-[#132a1a] border border-[#1f6b33] text-green-300 hover:bg-[#164021]"
                  >
                    <Plus size={14} /> Add
                  </button>
                </div>
                {draft.education?.length ? (
                  draft.education.map((ed, i) => (
                    <div
                      key={i}
                      className="rounded-md bg-[#141414] border border-[#2a2a2a] p-3 mb-3"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[#FFD700] text-sm font-medium">
                          Education #{i + 1}
                        </span>
                        <button
                          onClick={() => removeEducation(i)}
                          className="flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-[#2a1111] border border-[#6b1f1f] text-red-300 hover:bg-[#401616]"
                        >
                          <Minus size={12} /> Remove
                        </button>
                      </div>
                      <FieldRow
                        label="Institution"
                        value={ed.institution}
                        onChange={(v) =>
                          onFieldChange(`education.${i}.institution`, v)
                        }
                        changed={isPathChanged(
                          editedData,
                          employee,
                          `education.${i}.institution`
                        )}
                      />
                      <FieldRow
                        label="Degree"
                        value={ed.degree}
                        onChange={(v) =>
                          onFieldChange(`education.${i}.degree`, v)
                        }
                        changed={isPathChanged(
                          editedData,
                          employee,
                          `education.${i}.degree`
                        )}
                      />
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400">No education records.</div>
                )}
              </motion.div>
            )}

            {activeTab === "skills" && (
              <motion.div key="skills" {...tabAnim}>
                <div className="flex justify-end mb-2">
                  <button
                    onClick={addSkill}
                    className="flex items-center gap-1 text-sm px-3 py-1 rounded-md bg-[#132a1a] border border-[#1f6b33] text-green-300 hover:bg-[#164021]"
                  >
                    <Plus size={14} /> Add Skill
                  </button>
                </div>
                {draft.skills?.length ? (
                  draft.skills.map((sk, i) => (
                    <div
                      key={i}
                      className="rounded-md bg-[#141414] border border-[#2a2a2a] p-3 mb-3 flex items-center justify-between"
                    >
                      <FieldRow
                        label={`Skill #${i + 1}`}
                        value={sk}
                        onChange={(v) => onFieldChange(`skills.${i}`, v)}
                        changed={isPathChanged(editedData, employee, `skills.${i}`)}
                      />
                      <button
                        onClick={() => removeSkill(i)}
                        className="ml-3 flex-shrink-0 flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-[#2a1111] border border-[#6b1f1f] text-red-300 hover:bg-[#401616]"
                      >
                        <Minus size={12} /> Remove
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400">No skills added.</div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex justify-center mt-5">
          <button
            onClick={() => setShowConfirm(true)}
            className="px-6 py-2 text-black font-semibold rounded-full bg-[#FFD700] hover:scale-105 transition"
          >
            Update
          </button>
        </div>

        {showConfirm && (
          <ConfirmOverlay
            onConfirm={handleConfirmUpdate}
            onCancel={() => setShowConfirm(false)}
          />
        )}
      </div>
    </div>
  );
}
