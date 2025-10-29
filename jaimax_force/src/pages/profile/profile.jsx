import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Briefcase,
  Building2,
  CalendarDays,
  MapPin,
  ShieldCheck,
  Users,
  Clock,
  Lock,
  Loader2,
  X,
  EyeOff,
  Eye,
} from "lucide-react";
import { useChangePasswordMutation } from "../../features/profile/profileApiSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { Formik, Form, Field } from "formik";

export default function Profile() {
  const profile = useSelector((state) => state.profile?.data);
  console.log(profile);
  const isLoading = !profile;
  const [changePassword, { isLoading: changing }] = useChangePasswordMutation();

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // const profile = data?.data || {};
  const personal = profile?.personalInfo || {};
  const company = profile?.companyInfo || {};
  const manager = company?.reportingManager;

  const handleChangePassword = async (values) => {
    const { currentPassword, newPassword, confirmPassword } = values;

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.warn("Please fill all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      const res = await changePassword({
        currentPassword,
        newPassword,
      }).unwrap();
      toast.success(res?.message || "Password changed successfully");
      setShowModal(false);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to change password");
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen bg-black text-gray-400">
        Loading profile...
      </div>
    );

  if (!profile)
    return (
      <div className="flex justify-center items-center h-screen bg-black text-red-400">
        Failed to load profile: {error?.data?.message || "Something went wrong"}
      </div>
    );

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.split(" ");
    return parts
      .map((p) => p[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-y-auto p-2">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-[1400px] mx-auto px-2 lg:px-2 py-10">
        <div className="bg-neutral-950 border border-neutral-700 rounded-2xl p-6 sm:p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8">
            <div className="flex flex-col md:flex-col lg:flex-row items-center lg:items-start justify-center text-center lg:text-left gap-6 sm:gap-8 w-full">
              <div className="relative flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-[#FFD700]/40 shadow-[0_0_15px_#FFD70040] bg-gradient-to-br from-black to-[#1a1a1a] flex items-center justify-center mx-auto lg:mx-0">
                {profile.profilePicture ? (
                  <img
                    src={profile.profilePicture}
                    alt={profile.fullName}
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      const fallback =
                        e.currentTarget.parentElement?.querySelector(
                          ".fallback-initials"
                        );
                      if (fallback) fallback.style.display = "flex";
                    }}
                  />
                ) : null}

                {(!profile?.profilePicture ||
                  profile?.profilePicture === null) && (
                  <div className="absolute inset-0 flex items-center justify-center text-[#FFD700] text-3xl font-semibold bg-transparent fallback-initials">
                    {getInitials(profile.fullName)}
                  </div>
                )}
              </div>

              <div className="flex flex-col items-center lg:items-start">
                <h1 className="text-2xl sm:text-3xl font-light mb-1">
                  {profile.fullName || "Employee"}
                </h1>
                <p className="text-gray-500 text-sm mb-3">
                  {profile.employeeId}
                </p>

                <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                  <Badge
                    icon={<Briefcase size={12} />}
                    text={profile.authentication?.role || "N/A"}
                    color="yellow"
                  />
                  <Badge
                    icon={<Building2 size={12} />}
                    text={company.department || "N/A"}
                    color="gray"
                  />
                  {company.probationPeriod?.isOnProbation && (
                    <Badge
                      icon={<Clock size={12} />}
                      text="On Probation"
                      color="orange"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Change Password */}
            <div className="flex justify-center lg:justify-start w-full lg:w-[45%]">
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center justify-center gap-1 px-5 py-2 sm:py-2.5 rounded-lg bg-[#FFD700] hover:bg-[#FFC800] text-black font-semibold text-sm sm:text-base transition-all duration-200"
              >
                <Lock size={16} />
                Change Password
              </button>
            </div>
          </div>
        </div>

        {/* ======= MAIN GRID ======= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">
          {/* LEFT COLUMN */}
          <div className="space-y-6 ">
            <Section title="Personal Information" icon={<User size={20} />}>
              <div className="grid sm:grid-cols-2 gap-4">
                <InfoCard
                  icon={<Mail size={16} />}
                  label="Email"
                  value={personal.email || "N/A"}
                />
                <InfoCard
                  icon={<Phone size={16} />}
                  label="Phone"
                  value={personal.phone || "N/A"}
                />
                <InfoCard
                  icon={<CalendarDays size={16} />}
                  label="Date of Birth"
                  value={
                    personal.dateOfBirth
                      ? new Date(personal.dateOfBirth).toLocaleDateString(
                          "en-GB"
                        )
                      : "N/A"
                  }
                />
                <InfoCard
                  icon={<User size={16} />}
                  label="Gender"
                  value={personal.gender || "N/A"}
                />
                <InfoCard
                  icon={<MapPin size={16} />}
                  label="Address"
                  value={
                    personal.address
                      ? `${personal.address.street}\n${personal.address.city}\n${personal.address.state} - ${personal.address.pincode}`
                      : "N/A"
                  }
                  className="whitespace-pre-line"
                />
                <InfoCard
                  icon={<MapPin size={16} />}
                  label="Country"
                  value={personal?.address?.country || "N/A"}
                />
              </div>
            </Section>

            {/* Leave Balance */}
            {/* {profile.leaveBalance && (
              <Section title="Leave Balance" icon={<CalendarDays size={20} />}>
                <div className="space-y-3">
                  <LeaveItem
                    label="Casual Leave"
                    value={profile.leaveBalance.casualLeave}
                    color="blue"
                  />
                  <LeaveItem
                    label="Sick Leave"
                    value={profile.leaveBalance.sickLeave}
                    color="red"
                  />
                  <LeaveItem
                    label="Privilege Leave"
                    value={profile.leaveBalance.privilegeLeave}
                    color="green"
                  />
                </div>
              </Section>
            )} */}
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            <Section title="Company Information" icon={<Building2 size={20} />}>
              <div className="grid sm:grid-cols-2 gap-4">
                <InfoCard
                  icon={<Briefcase size={16} />}
                  label="Designation"
                  value={company.designation || "N/A"}
                />
                <InfoCard
                  icon={<Building2 size={16} />}
                  label="Department"
                  value={company.department || "N/A"}
                />
                <InfoCard
                  icon={<CalendarDays size={16} />}
                  label="Date of Joining"
                  value={
                    company.dateOfJoining
                      ? new Date(company.dateOfJoining).toLocaleDateString(
                          "en-GB"
                        )
                      : "N/A"
                  }
                />
                <InfoCard
                  icon={<ShieldCheck size={16} />}
                  label="Employment Type"
                  value={company.employmentType || "N/A"}
                />
                <InfoCard
                  icon={<MapPin size={16} />}
                  label="Work Location"
                  value={company.workLocation || "N/A"}
                />
                <InfoCard
                  icon={<Clock size={16} />}
                  label="Work Shift"
                  value={company.workShift || "N/A"}
                />
              </div>

              {/* {manager && (
                <div className="mt-4 p-4 rounded-xl bg-black border border-neutral-800">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <Users size={16} />
                    <h4 className="text-sm font-medium">Reporting Manager</h4>
                  </div>
                  <p className="text-sm text-white font-medium">
                    {manager.fullName ||
                      `${manager.personalInfo?.firstName || ""} ${
                        manager.personalInfo?.lastName || ""
                      }`}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {manager.employeeId}
                  </p>
                </div>
              )}

              {company.probationPeriod?.isOnProbation && (
                <div className="mt-4 p-4 rounded-xl bg-orange-500/5 border border-orange-500/20">
                  <div className="flex items-center gap-2 text-orange-400 mb-2">
                    <Clock size={16} />
                    <h4 className="text-sm font-medium">Probation Period</h4>
                  </div>
                  <p className="text-sm text-gray-300">
                    Ends on:{" "}
                    {new Date(
                      company.probationPeriod.probationEndDate
                    ).toLocaleDateString("en-GB")}
                  </p>
                </div>
              )} */}
            </Section>
          </div>

          {/* <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-6"> */}
          {/* Leave Balance */}
          <Section title="Leave Balance" icon={<CalendarDays size={20} />}>
            <div className="grid sm:grid-cols-1 gap-4">
              <InfoCard
                icon={<CalendarDays size={16} />}
                label="Casual Leave"
                value={
                  `Remaining: ${profile.leaveBalance?.casualLeave}` ?? "N/A"
                }
              />
              <InfoCard
                icon={<CalendarDays size={16} />}
                label="Sick Leave"
                value={`Remaining: ${profile.leaveBalance?.sickLeave}` ?? "N/A"}
              />
              <InfoCard
                icon={<CalendarDays size={16} />}
                label="Privilege Leave"
                value={
                  `Remaining: ${profile.leaveBalance?.privilegeLeave}` ?? "N/A"
                }
              />
            </div>
          </Section>

          {/* Employee Status */}
          <Section title="Employee Status" icon={<Users size={20} />}>
            <div className="space-y-3">
              <InfoCard
                icon={<Users size={16} />}
                label="Reporting Manager"
                value={
                  company?.reportingManager?.fullName ||
                  `${
                    company?.reportingManager?.personalInfo?.firstName || ""
                  } ${
                    company?.reportingManager?.personalInfo?.lastName || ""
                  }`.trim() ||
                  "N/A"
                }
              />
              <InfoCard
                icon={<CalendarDays size={16} />}
                label="Probation End Date"
                value={
                  company?.probationPeriod?.probationEndDate
                    ? new Date(
                        company.probationPeriod.probationEndDate
                      ).toLocaleDateString("en-GB")
                    : "N/A"
                }
              />
              <InfoCard
                icon={<ShieldCheck size={16} />}
                label="Is on Probation"
                // className={
                //   company?.probationPeriod?.isOnProbation
                //     ? "!text-[#FFD700]"
                //     : "text-white"
                // }
                value={
                  company?.probationPeriod?.isOnProbation
                    ? "Yes"
                    : company?.probationPeriod
                    ? "No"
                    : "N/A"
                }
              />
            </div>
          </Section>
          {/* </div> */}
        </div>
      </div>

      {/* ======= PASSWORD MODAL ======= */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-neutral-950 border border-neutral-600 rounded-2xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-500/10 text-[#FFD700]">
                  <Lock size={20} />
                </div>
                <h2 className="text-xl font-light text-[#FFD700]">
                  Change Password
                </h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-white hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Formik Form */}
            <Formik
              initialValues={{
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
              }}
              validate={(values) => {
                const errors = {};
                if (!values.currentPassword)
                  errors.currentPassword = "Current password required";
                if (!values.newPassword)
                  errors.newPassword = "New password required";
                if (!values.confirmPassword)
                  errors.confirmPassword = "Confirm your new password";
                if (
                  values.newPassword &&
                  values.confirmPassword &&
                  values.newPassword !== values.confirmPassword
                ) {
                  errors.confirmPassword = "Passwords do not match";
                }
                return errors;
              }}
              onSubmit={(values) => handleChangePassword(values)}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form className="space-y-4">
                  <PasswordField
                    label="Current Password"
                    name="currentPassword"
                    error={touched.currentPassword && errors.currentPassword}
                  />
                  <PasswordField
                    label="New Password"
                    name="newPassword"
                    error={touched.newPassword && errors.newPassword}
                  />
                  <PasswordField
                    label="Confirm New Password"
                    name="confirmPassword"
                    error={touched.confirmPassword && errors.confirmPassword}
                  />

                  <button
                    type="submit"
                    disabled={isSubmitting || changing}
                    className="w-full mt-6 py-3 rounded-xl bg-[#FFD700] hover:bg-[#FFC800] text-black font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isSubmitting || changing ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="animate-spin" size={18} />
                        Updating...
                      </span>
                    ) : (
                      "Update Password"
                    )}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
}

/* ====== Reusable Sub-Components ====== */
function Section({ title, icon, children }) {
  return (
    <div className="bg-neutral-950 border border-neutral-700 rounded-2xl p-6 text-[#FFD700]">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 rounded-lg bg-neutral-900 text-[#FFD700]">
          {icon}
        </div>
        <h3 className="text-lg font-light">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function InfoCard({ icon, label, value, className = "" }) {
  return (
    <div
      className={`p-4 rounded-xl bg-black border border-[#FFD700]/30 hover:border-[#FFD700]/40 transition w-full`}
    >
      <div className={`flex items-center gap-2 text-gray-400 mb-2`}>
        {icon}
        <span className={`text-xs font-medium uppercase tracking-wider`}>
          {label}
        </span>
      </div>
      <p className={`text-sm font-medium text-white truncate ${className}`}>{value}</p>
    </div>
  );
}

// function LeaveItem({ label, value, color }) {
//   const colors = {
//     blue: "text-blue-400",
//     red: "text-red-400",
//     green: "text-green-400",
//   };
//   return (
//     <div className="flex items-center justify-between p-3 rounded-lg bg-black border border-neutral-700">
//       <span className="text-sm text-gray-400">{label}</span>
//       <span className={`text-xl font-light ${colors[color]}`}>{value}</span>
//     </div>
//   );
// }

// function InputField({ label, type, value, onChange }) {
//   return (
//     <div>
//       <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">
//         {label}
//       </label>
//       <input
//         type={type}
//         className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-[#FFD700] focus:outline-none transition"
//         value={value}
//         onChange={onChange}
//       />
//     </div>
//   );
// }

function Badge({ icon, text, color }) {
  const colors = {
    yellow: "bg-yellow-500/10 border-yellow-500/20 text-yellow-500",
    gray: "bg-neutral-900 border-neutral-800 text-gray-400",
    orange: "bg-orange-500/10 border-orange-500/20 text-orange-400",
  };
  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border text-xs font-medium ${colors[color]}`}
    >
      {icon}
      {text}
    </span>
  );
}

function PasswordField({ label, name, error }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label
        htmlFor={name}
        className="text-xs text-white uppercase tracking-wider mb-2 block"
      >
        {label}
      </label>

      <div className="relative">
        <Field
          id={name}
          name={name}
          type={show ? "text" : "password"}
          className="w-full bg-black border border-neutral-600 rounded-xl px-4 py-3 text-white focus:border-[#FFD700] focus:outline-none transition pr-10"
        />
        <button
          type="button"
          onClick={() => setShow((prev) => !prev)}
          className="absolute right-3 top-3 text-gray-400 hover:text-[#FFD700] transition"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}
