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
} from "lucide-react";
import { useChangePasswordMutation } from "../../features/profile/profileApiSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";

export default function Profile() {
  // const { data, isLoading, isError, error } = useGetProfileQuery();
  const profile = useSelector((state) => state.profile?.data);
  // console.log(profile);
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
  const manager = company?.reportingManager || {};

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = form;

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.warn("Please fill all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      const res = await changePassword({ currentPassword, newPassword }).unwrap();
      toast.success(res?.message || "Password changed successfully");
      setShowModal(false);
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
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
    return parts.map((p) => p[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-y-auto">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-[1400px] mx-auto px-2 lg:px-2 py-10">
        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 sm:p-8 mb-8">
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
                      e.currentTarget.nextElementSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                {(!profile?.profilePicture || profile?.profilePicture === null) &&(
<div className="absolute inset-0 flex items-center justify-center text-[#FFD700] text-3xl font-semibold bg-transparent">
                  {getInitials(profile.fullName)}
                </div>
                )}
                
              </div>

              <div className="flex flex-col items-center lg:items-start">
                <h1 className="text-2xl sm:text-3xl font-light mb-1">
                  {profile.fullName || "Employee"}
                </h1>
                <p className="text-gray-500 text-sm mb-3">{profile.employeeId}</p>

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
                    <Badge icon={<Clock size={12} />} text="On Probation" color="orange" />
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
        <div className="grid lg:grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left 2 cols */}
          <div className="xl:col-span-2 space-y-6">
            <Section title="Personal Information" icon={<User size={20} />}>
              <div className="grid sm:grid-cols-2 gap-4">
                <InfoCard icon={<Mail size={16} />} label="Email" value={personal.email || "N/A"} />
                <InfoCard icon={<Phone size={16} />} label="Phone" value={personal.phone || "N/A"} />
                <InfoCard
                  icon={<CalendarDays size={16} />}
                  label="Date of Birth"
                  value={
                    personal.dateOfBirth
                      ? new Date(personal.dateOfBirth).toLocaleDateString("en-GB")
                      : "N/A"
                  }
                />
                <InfoCard icon={<User size={16} />} label="Gender" value={personal.gender || "N/A"} />
              </div>
            </Section>

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
                      ? new Date(company.dateOfJoining).toLocaleDateString("en-GB")
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

              {manager && (
                <div className="mt-4 p-4 rounded-xl bg-black border border-neutral-800">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <Users size={16} />
                    <h4 className="text-sm font-medium">Reporting Manager</h4>
                  </div>
                  <p className="text-sm text-white font-medium">
                    {manager.fullName ||
                      `${manager.personalInfo?.firstName || ""} ${manager.personalInfo?.lastName || ""}`}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{manager.employeeId}</p>
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
                    {new Date(company.probationPeriod.probationEndDate).toLocaleDateString("en-GB")}
                  </p>
                </div>
              )}
            </Section>

            {/* Leave Balance (moved below for better mobile view) */}
            {profile.leaveBalance && (
              <Section title="Leave Balance" icon={<CalendarDays size={20} />}>
                <div className="space-y-3">
                  <LeaveItem label="Casual Leave" value={profile.leaveBalance.casualLeave} color="blue" />
                  <LeaveItem label="Sick Leave" value={profile.leaveBalance.sickLeave} color="red" />
                  <LeaveItem label="Privilege Leave" value={profile.leaveBalance.privilegeLeave} color="green" />
                </div>
              </Section>
            )}
          </div>
        </div>
      </div>

      {/* ======= PASSWORD MODAL ======= */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-500">
                  <Lock size={20} />
                </div>
                <h2 className="text-xl font-light">Change Password</h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <InputField
                label="Current Password"
                type="password"
                value={form.currentPassword}
                onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
              />
              <InputField
                label="New Password"
                type="password"
                value={form.newPassword}
                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
              />
              <InputField
                label="Confirm New Password"
                type="password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              />

              <button
                type="submit"
                disabled={changing}
                className="w-full mt-6 py-3 rounded-xl bg-[#FFD700] hover:bg-[#FFC800] text-black font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {changing ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin" size={18} />
                    Updating...
                  </span>
                ) : (
                  "Update Password"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ====== Reusable Sub-Components ====== */
function Section({ title, icon, children }) {
  return (
    <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 rounded-lg bg-neutral-900 text-gray-400">{icon}</div>
        <h3 className="text-lg font-light">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function InfoCard({ icon, label, value }) {
  return (
    <div className="p-4 rounded-xl bg-black border border-neutral-800 hover:border-neutral-700 transition">
      <div className="flex items-center gap-2 text-gray-500 mb-2">
        {icon}
        <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-sm text-white font-medium truncate">{value}</p>
    </div>
  );
}

function LeaveItem({ label, value, color }) {
  const colors = {
    blue: "text-blue-400",
    red: "text-red-400",
    green: "text-green-400",
  };
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-black border border-neutral-800">
      <span className="text-sm text-gray-400">{label}</span>
      <span className={`text-xl font-light ${colors[color]}`}>{value}</span>
    </div>
  );
}

function InputField({ label, type, value, onChange }) {
  return (
    <div>
      <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">{label}</label>
      <input
        type={type}
        className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-[#FFD700] focus:outline-none transition"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

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
