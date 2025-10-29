import { ErrorMessage, Field, Form, Formik } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import loginImg from "../../assets/images/image-log.png";
import { setCredentials } from "../../features/auth/authSlice";
import {
  useForgotPasswordMutation,
  useLoginMutation,
} from "../../features/auth/loginApiSlice";
import { toast, ToastContainer } from "../../features/helpers/Toaster";
import bg from "../../assets/images/grids.webp";
import logo from "../../assets/images/jForceYellow-1.svg";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading: loggingIn }] = useLoginMutation();
  const [forgotPassword, { isLoading: sendingReset }] =
    useForgotPasswordMutation();

  const isBusy = loggingIn || sendingReset;

  // --- Validation Schema ---
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    ...(forgotMode
      ? {}
      : {
          password: Yup.string().required("Password is required"),
        }),
  });

  // --- Handle Login ---
  const handleLogin = async (values) => {
    try {
      const res = await login(values).unwrap();
      if (res?.success === 1 && res?.data) {
        const { accessToken, refreshToken, user } = res.data;
        dispatch(setCredentials({ user, accessToken, refreshToken }));

        setTimeout(() => {
          const storedUser = JSON.parse(localStorage.getItem("user"));
          if (storedUser && storedUser.fullName) {
            toast.success("Login success!", res?.message || "Login successful!");
            navigate("/dashboard");
          } else {
            toast.error("Failed to load profile. Please retry.");
          }
        }, 0);
      } else {
        toast.error(res?.message || "Login failed.");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  // --- Handle Forgot Password ---
  const handleForgotPassword = async (values) => {
    try {
      const res = await forgotPassword(values.email).unwrap();
      toast.success(res?.message || "Password reset link sent to your email.");
      setTimeout(() => setForgotMode(false), 1500);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to send reset link.");
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col lg:flex-row bg-black text-white font-sans overflow-hidden"
    style={{ 
      backgroundImage: `linear-gradient(180deg, #000000e6, #000c 70%, #050505), url(${bg})`,
    backgroundSize: "cover",
    }}
    >
      <ToastContainer />

      {/* === Top Branding === */}
      <div  className="absolute top-4 left-6 cursor-pointer transition-transform duration-500 hover:scale-110 active:scale-95"
      onClick={() => navigate("/")}>
        {/* <span className="text-[#FFD700]">JAI</span>
        <span className="text-white">MAX</span> */}
        <img src={logo} alt="Logo" width={200}/>
      </div>

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

      {/* === LEFT IMAGE (Desktop ≥1024px only) === */}
      <div className="hidden lg:flex w-1/2 h-screen items-center justify-center p-8">
        <img
          src={loginImg}
          alt="Login Illustration"
          className="w-full h-auto object-contain max-h-[90%]"
        />
      </div>

      {/* === RIGHT FORM === */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative w-full max-w-md sm:max-w-lg md:max-w-md 
             rounded-2xl p-6 sm:p-8 md:p-10
             border border-[#FFD700]/25 md:mt-7 lg:mt-auto mt-20
             bg-[#0f0f0f]/60 backdrop-blur-md
             shadow-[0_4px_8px_rgba(0,0,0,0.2),_0_6px_20px_rgba(0,0,0,0.19)]
             transition-all duration-500 ease-in-out overflow-hidden mx-auto my-auto"
        >
          <div className="mb-6 sm:mb-8 text-center mt-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#FFD700] mb-2">
              {forgotMode ? "Forgot Password" : "Welcome Back"}
            </h2>
            <p className="text-xs sm:text-sm text-white leading-relaxed px-2">
              {forgotMode
                ? "Enter your registered email to receive the reset link"
                : "Sign in to continue your Jaimax journey"}
            </p>
          </div>

          {/* === FORM START === */}
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={(values) =>
              forgotMode ? handleForgotPassword(values) : handleLogin(values)
            }
          >
            {({ errors, touched }) => (
              <Form className="space-y-5 sm:space-y-6">
                {/* Email Field */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-2 text-[#FFD700]">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-gray-500" />
                    <Field
                      name="email"
                      type="email"
                      placeholder="you@jaimax.com"
                      className={`w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 rounded-lg bg-[#1a1a1a] border ${
                        errors.email && touched.email
                          ? "border-red-500"
                          : "border-[#626161]"
                      } text-white text-sm sm:text-base focus:border-[#FFD700]`}
                    />
                  </div>
                  <ErrorMessage
                    name="email"
                    component="p"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                {/* Password Field */}
                {!forgotMode && (
                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-2 text-[#FFD700]">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-gray-500" />
                      <Field
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className={`w-full pl-10 sm:pl-11 pr-10 sm:pr-12 py-2.5 sm:py-3 rounded-lg bg-[#1a1a1a] border ${
                          errors.password && touched.password
                            ? "border-red-500"
                            : "border-[#626161]"
                        } text-white text-sm sm:text-base focus:border-[#FFD700]`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#FFD700]"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    <ErrorMessage
                      name="password"
                      component="p"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                )}

                {/* Forgot Password Button */}
                {!forgotMode && (
                  <div className="flex justify-end text-xs sm:text-sm">
                    <button
                      type="button"
                      onClick={() => setForgotMode(true)}
                      className="text-[#FFD700] font-medium hover:underline hover:decoration-yellow-400 "
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isBusy}
                  className="w-full py-2.5 sm:py-3 font-semibold text-black text-sm sm:text-base bg-gradient-to-r from-[#FFD700] to-[#FFC800] rounded-lg hover:from-[#FFC800] hover:to-[#FFD700] transition-all"
                >
                  {isBusy
                    ? forgotMode
                      ? "Sending..."
                      : "Signing in..."
                    : forgotMode
                    ? "Continue"
                    : "Login"}
                </button>

                {/* Back Button */}
                {forgotMode && (
                  <button
                    type="button"
                    onClick={() => setForgotMode(false)}
                    className="w-full py-2 text-xs sm:text-sm text-gray-400 hover:text-white hover:underline hover:decoration-white"
                  >
                    Back to Login
                  </button>
                )}
              </Form>
            )}
          </Formik>
          {/* === FORM END === */}
        </motion.div>
      </div>
    </div>
  );
}
