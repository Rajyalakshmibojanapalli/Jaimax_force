import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useLoginMutation,
  useForgotPasswordMutation,
} from "../../features/auth/loginApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../features/auth/authSlice";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotMode, setForgotMode] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading: loggingIn }] = useLoginMutation();
  const [forgotPassword, { isLoading: sendingReset }] =
    useForgotPasswordMutation();

  // --- LOGIN HANDLER ---
  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await login({ email, password }).unwrap();

    if (res?.success === 1 && res?.data) {
      const { accessToken, refreshToken, user } = res.data;

      // Save credentials
      dispatch(setCredentials({ user, accessToken, refreshToken }));

      // onfirm they are actually stored before routing
      setTimeout(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser && storedUser.fullName) {
          toast.success("Login successful!");
          navigate("/dashboard");
        } else {
          toast.error("Failed to load profile. Please retry.");
        }
      }, 0); // short delay to allow React to re-render
    } else {
      toast.error(res?.message || "Login failed.");
    }
  } catch (err) {
    toast.error(err?.data?.message || "Something went wrong");
  }
};


  // --- FORGOT PASSWORD HANDLER ---
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await forgotPassword(email).unwrap();
      toast.success(res?.message || "Password reset link sent to your email.");
      setTimeout(() => setForgotMode(false), 1500);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to send reset link.");
    }
  };

  const isBusy = loggingIn || sendingReset;

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black text-white overflow-hidden font-sans px-4 sm:px-6 lg:px-12">
      <ToastContainer />

      {/* === Loader Overlay === */}
      <AnimatePresence>
        {isBusy && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="flex flex-col items-center gap-3"
            >
              <Loader2 className="w-10 h-10 animate-spin text-[#FFD700]" />
              <p className="text-sm text-gray-300">
                {loggingIn ? "Signing you in..." : "Sending link..."}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md sm:max-w-lg md:max-w-md bg-[#0f0f0f]/80 border border-[#FFD700]/20 rounded-2xl p-6 sm:p-8 md:p-10 shadow-[0_0_40px_rgba(255,215,0,0.1)]"
      >
        <div className="mb-6 sm:mb-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            {forgotMode ? "Forgot Password" : "Welcome Back"}
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed px-2">
            {forgotMode
              ? "Enter your registered email to receive the reset link"
              : "Sign in to continue your Jaimax journey"}
          </p>
        </div>

        {/* === Login Form === */}
        {!forgotMode && (
          <form className="space-y-5 sm:space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-2 text-gray-300">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 rounded-lg bg-[#1a1a1a] border border-[#333] text-white text-sm sm:text-base focus:border-[#FFD700]"
                  placeholder="you@jaimax.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium mb-2 text-gray-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 sm:pl-11 pr-10 sm:pr-12 py-2.5 sm:py-3 rounded-lg bg-[#1a1a1a] border border-[#333] text-white text-sm sm:text-base focus:border-[#FFD700]"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#FFD700]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end text-xs sm:text-sm">
              <button
                type="button"
                onClick={() => setForgotMode(true)}
                className="text-[#FFD700] hover:text-[#FFD700]/80 font-medium"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-2.5 sm:py-3 font-semibold text-black text-sm sm:text-base bg-gradient-to-r from-[#FFD700] to-[#FFC800] rounded-lg hover:from-[#FFC800] hover:to-[#FFD700] transition-all"
            >
              {loggingIn ? "Signing in..." : "Login"}
            </button>
          </form>
        )}

        {/* === Forgot Password Form === */}
        {forgotMode && (
          <form
            className="space-y-5 sm:space-y-6"
            onSubmit={handleForgotPassword}
          >
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-2 text-gray-300">
                Registered Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-[#1a1a1a] border border-[#333] text-white text-sm sm:text-base focus:border-[#FFD700]"
                placeholder="you@jaimax.com"
                required
              />
            </div>

            <button
              type="submit"
              disabled={sendingReset}
              className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-[#FFD700] to-[#FFC800] text-black text-sm sm:text-base font-semibold rounded-lg hover:from-[#FFC800] hover:to-[#FFD700]"
            >
              {sendingReset ? "Sending..." : "Continue"}
            </button>

            <button
              type="button"
              onClick={() => setForgotMode(false)}
              className="w-full py-2 text-xs sm:text-sm text-gray-400 hover:text-white"
            >
              Back to Login
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
