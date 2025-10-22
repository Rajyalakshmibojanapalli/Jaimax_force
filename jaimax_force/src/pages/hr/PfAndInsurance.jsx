import React, { useState } from "react";
import { Wallet, FileText, Save, Edit3, CheckCircle, X } from "lucide-react";

export default function PfAndInsurance() {
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;
  const role = user?.role || "employee";

  const [form, setForm] = useState({
    pfNumber: "",
    uanNumber: "",
    esiNumber: "",
    insuranceProvider: "",
    policyNumber: "",
    insuranceCoverage: "",
  });

  const [isEditing, setIsEditing] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (
      !form.pfNumber ||
      !form.uanNumber ||
      !form.insuranceProvider ||
      !form.policyNumber
    ) {
      alert("Please fill all mandatory fields.");
      return;
    }

    setIsEditing(false);
    setIsSubmitted(true);
    alert("PF & Insurance details submitted successfully!");
  };

  const handleEdit = () => {
    setIsEditing(true);
    setIsSubmitted(false);
  };

  return (
    <div className="flex flex-col flex-1 overflow-y-auto bg-[#0f0f0f] text-white p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-[#FFD700] flex items-center gap-2">
          <Wallet size={24} /> PF & Insurance Details
        </h1>
        <p className="text-sm text-gray-400">
          Logged in as <span className="text-[#FFD700] capitalize">{role}</span>
        </p>
      </div>

      {/* PF Form */}
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 shadow-md">
        <h2 className="text-xl font-semibold text-[#FFD700] mb-6 flex items-center gap-2">
          <FileText size={20} /> Your Financial Information
        </h2>

        <div className="grid sm:grid-cols-2 gap-6">
          <InputField
            label="PF Account Number"
            name="pfNumber"
            value={form.pfNumber}
            onChange={handleChange}
            disabled={!isEditing}
            required
          />
          <InputField
            label="UAN Number"
            name="uanNumber"
            value={form.uanNumber}
            onChange={handleChange}
            disabled={!isEditing}
            required
          />
          <InputField
            label="ESI Number"
            name="esiNumber"
            value={form.esiNumber}
            onChange={handleChange}
            disabled={!isEditing}
          />
          <InputField
            label="Insurance Provider"
            name="insuranceProvider"
            value={form.insuranceProvider}
            onChange={handleChange}
            disabled={!isEditing}
            required
          />
          <InputField
            label="Policy Number"
            name="policyNumber"
            value={form.policyNumber}
            onChange={handleChange}
            disabled={!isEditing}
            required
          />
          <InputField
            label="Coverage Amount"
            name="insuranceCoverage"
            value={form.insuranceCoverage}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          {isEditing ? (
            <>
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-gradient-to-r from-[#18a04a] to-[#c1d42c] text-black rounded-full font-semibold hover:scale-105 transition"
              >
                <Save size={16} className="inline mr-1" /> Submit
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 border border-gray-600 rounded-full text-gray-300 hover:bg-[#222] transition"
              >
                Cancel
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-green-400 flex items-center gap-1">
                <CheckCircle size={16} /> Submitted
              </span>
              <button
                onClick={handleEdit}
                className="px-5 py-2 border border-[#FFD700]/40 text-[#FFD700] rounded-full hover:bg-[#FFD700]/20 transition"
              >
                <Edit3 size={16} className="inline mr-1" /> Edit Again
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-8 text-sm text-gray-400">
        Once submitted, your PF and Insurance details will be verified by HR and
        kept securely for payroll and compliance purposes.
      </div>
    </div>
  );
}

/* --- Reusable Input Field --- */
const InputField = ({ label, name, value, onChange, disabled, required }) => (
  <div>
    <label className="text-sm text-gray-400 block mb-1">
      {label}
      {required && <span className="text-red-400 ml-1">*</span>}
    </label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      placeholder={disabled ? "" : "Enter " + label.toLowerCase()}
      className={`w-full p-2 rounded-md bg-[#111] border ${
        disabled ? "border-[#333] text-gray-400" : "border-[#FFD700]/40"
      } text-white focus:border-[#FFD700] outline-none`}
    />
  </div>
);
