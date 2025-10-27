import React, { useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "../../features/auth/loginApiSlice";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import { AlertTriangle } from "lucide-react";
import { clearProfile } from "../../features/profile/profileSlice";
import { persistor } from "../../app/store";
import { clearAttendance } from "../../features/attendance/attendanceSlice";

export default function LogoutModal({
  triggerText = "Logout",
  variant = "button", // "button" (navbar) or "link" (sidebar)
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [logoutUser, { isLoading }] = useLogoutUserMutation();
  const dispatch = useDispatch();

  const handleLogout = async () => {
  try {
    const res = await logoutUser().unwrap();
    toast.success(res?.message || "You’ve been logged out successfully!", {
      position: "top-center",
      autoClose: 1500,
      theme: "dark",
    });

    setTimeout(() => {
      dispatch(logout()); // Clear tokens AFTER showing toast
      setOpen(false);
      dispatch(clearProfile());
      dispatch(clearAttendance());
      persistor.purge();
      navigate("/login");
    }, 1000);
  } catch (err) {
    toast.error(err?.data?.message || "Logout failed. Please try again.");
  }
};

  const triggerStyles =
    variant === "button"
      ? `bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition ${className}`
      : `flex items-center gap-3 py-2 px-3 rounded-md hover:bg-[#222] text-white transition ${className}`;

  const modalRoot = document.getElementById("modal-root") || document.body;

  return (
    <>
      {/* Trigger Button */}
      <button onClick={() => setOpen(true)} className={triggerStyles}>
        {triggerText}
      </button>

      {/* Modal Portal */}
      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              key="modal-bg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[999] flex items-center justify-center bg-transparent backdrop-blur-sm"
            >
              <motion.div
                key="modal-content"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25 }}
                className="bg-[#1a1a1a] border border-[#FFD700]/30 rounded-2xl p-6 sm:p-8 shadow-2xl w-[90%] sm:w-[420px] text-center"
              >
                <AlertTriangle size={40} className="text-red-500 mx-auto mb-4"/>
                <h2 className="text-2xl font-bold text-[#FFD700] mb-4">
                  Confirm Logout
                </h2>
                <p className="text-gray-300 mb-8 text-sm sm:text-base leading-relaxed">
                  Are you sure you want to logout? You’ll be redirected to the
                  login page.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
                  <button
                    onClick={handleLogout}
                    disabled={isLoading}
                    className="px-6 py-2 bg-[#FFD700] text-black rounded-full font-semibold hover:scale-105 transition disabled:opacity-50"
                  >
                    {isLoading ? "Logging out..." : "Yes, Logout"}
                  </button>
                  <button
                    onClick={() => setOpen(false)}
                    className="px-6 py-2 border border-gray-600 text-gray-300 rounded-full hover:bg-gray-800 transition"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        modalRoot
      )}
    </>
  );
}
