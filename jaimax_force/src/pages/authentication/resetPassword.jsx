// src/pages/authentication/ResetPassword.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import { useResetPasswordMutation } from "../../features/auth/loginApiSlice";

export default function ResetPassword() {
  const { token } = useParams(); // token from URL
  const navigate = useNavigate();
  const [resetPassword, { isLoading: resetting }] = useResetPasswordMutation();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Validate token presence
  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing reset token");
      navigate("/");
    }
  }, [token, navigate]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await resetPassword({
        token,
        newPassword,
        confirmPassword,
      }).unwrap();

      toast.success(res?.message || "Password reset successfully!");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to reset password");
    }
  };

  return (
    <div className="relative min-h-screen flex bg-black text-white items-center justify-center">
      <ToastContainer />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md p-8 bg-[#0f0f0f]/80 border border-[#FFD700]/20 rounded-2xl shadow-[0_0_40px_rgba(255,215,0,0.1)]"
      >
        <h2 className="text-3xl font-bold text-center mb-2">
          Reset Your Password
        </h2>
        <p className="text-center text-gray-400 mb-6 text-sm">
          Enter your new password below.
        </p>

        <form onSubmit={handleResetPassword} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-[#1a1a1a] border border-[#333] text-white focus:border-[#FFD700]"
              placeholder="Enter new password"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-[#1a1a1a] border border-[#333] text-white focus:border-[#FFD700]"
              placeholder="Confirm password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={resetting}
            className="w-full py-3 bg-gradient-to-r from-[#FFD700] to-[#FFC800] text-black font-semibold rounded-lg hover:from-[#FFC800] hover:to-[#FFD700]"
          >
            {resetting ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
