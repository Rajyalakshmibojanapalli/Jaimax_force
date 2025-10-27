import { Briefcase, ChevronRight, GraduationCap } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useVerifyUserQuery } from "../../features/onboarding/onboardingApiSlice";
import {motion} from "framer-motion";

export default function OnBoarding() {
  const [isVisible, setIsVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Extract token
  const token =
    new URLSearchParams(location.search).get("token") ||
    location.pathname.split("/").pop();

  const invalidTokens = ["fresher", "experienced"];
  const skipVerification = invalidTokens.includes(token);

  const { data, isLoading, isError } = useVerifyUserQuery(token, {
    skip: !token || skipVerification,
  });

  useEffect(() => setIsVisible(true), []);

  useEffect(() => {
    if (data?.success === 1 || data?.success === true) {
      localStorage.setItem("onboardToken", token);
    }
  }, [data, token]);

  const handleContinue = () => {
    if (!selected) return toast.error("Please select a role to proceed.");
    navigate(`/onboarding/form/${selected}`);
  };

  useEffect(() => {
    if (skipVerification) {
      const timer = setTimeout(() => {
        navigate(`/onboarding/${token}/form`);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [skipVerification, token, navigate]);

  if (!token)
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black flex flex-col items-center justify-center text-white text-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
      >
        <p className="text-2xl font-semibold bg-gradient-to-r from-red-400 to-pink-600 bg-clip-text text-transparent animate-pulse">
          No Token Found
        </p>
        <p className="text-zinc-400 text-sm">
          The verification link seems incomplete or invalid.
        </p>
      </motion.div>
    </div>
  );

if (isLoading)
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black flex flex-col items-center justify-center text-white text-center px-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center space-y-4"
      >
        {/* Spinner */}
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-[#FFD700] animate-spin"></div>
          <div className="absolute inset-1 rounded-full bg-black"></div>
        </div>

        {/* Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
          className="text-lg font-medium text-[#FFD700]"
        >
          Verifying your invitation...
        </motion.p>
      </motion.div>
    </div>
  );

if (isError)
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black flex flex-col items-center justify-center text-white text-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-3"
      >
        <p className="text-2xl font-semibold text-red-500 animate-pulse">
          Invalid or Expired Link
        </p>
        <p className="text-zinc-400 text-sm">
          Please check your email for a new invitation or contact support.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600/30 hover:bg-red-600/50 text-sm font-medium rounded-lg backdrop-blur transition"
        >
          Retry
        </button>
      </motion.div>
    </div>
  );

  if (
    !skipVerification &&
    (!data || (data?.success !== 1 && data?.success !== true))
  )
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <p className="text-red-500 font-semibold">
          Invalid or unauthorized verification response.
        </p>
      </div>
    );

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden font-sans">
      <style>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp { animation: fadeInUp 0.8s ease-out forwards; }
        .grid-pattern {
          background-image: linear-gradient(#FFD700 1px, transparent 1px),
                            linear-gradient(90deg, #FFD700 1px, transparent 1px);
          background-size: 50px 50px;
          opacity: 0.05;
        }
        .gradient-text {
          background: linear-gradient(135deg, #FFD700 0%, #FFF 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>

      {/* Background */}
      <div className="absolute inset-0">
        <div className="grid-pattern absolute inset-0"></div>
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-[#FFD700]/5 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-[#FFD700]/5 to-transparent"></div>
      </div>

      {/* Main content */}
      <div
  className="relative z-10 container mx-auto px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 
             flex flex-col items-center justify-center text-center 
             min-h-screen pt-8 sm:pt-12 md:pt-16 lg:pt-0"
>
        {/* Header */}
        <div
          className={`inline-flex items-center gap-2 mb-6 sm:mb-8 ${
            isVisible ? "animate-fadeInUp" : "opacity-0"
          }`}
        >
          <div className="w-6 sm:w-8 h-px bg-[#FFD700]" />
          <span className="text-[10px] sm:text-xs text-[#FFD700] font-semibold tracking-[0.2em] uppercase">
            Begin Your Journey
          </span>
          <div className="w-6 sm:w-8 h-px bg-[#FFD700]" />
        </div>

        <h1
          className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight ${
            isVisible ? "animate-fadeInUp" : "opacity-0"
          }`}
        >
          <span className="text-white">Choose Your </span>
          <span className="gradient-text">Path</span>
        </h1>

        <p
          className={`text-sm sm:text-base md:text-lg text-gray-400 mb-10 sm:mb-12 max-w-[90%] sm:max-w-2xl ${
            isVisible ? "animate-fadeInUp" : "opacity-0"
          }`}
        >
          Select the role that defines your professional identity and let's get
          started with your personalized onboarding experience.
        </p>

        {/* Role Cards */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full max-w-xl sm:max-w-3xl ${
            isVisible ? "animate-fadeInUp" : "opacity-0"
          }`}
        >
          {/* Fresher */}
          <div
            onClick={() => setSelected("fresher")}
            className={`group cursor-pointer p-6 sm:p-8 rounded-2xl border-2 transition-all duration-300 ${
              selected === "fresher"
                ? "border-[#FFD700] bg-[#FFD700]/10 shadow-lg shadow-[#FFD700]/20"
                : "border-[#333] hover:border-[#FFD700]/40 hover:bg-[#111]"
            }`}
          >
            <div className="flex flex-col items-center gap-3 sm:gap-4">
              <div
                className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center ${
                  selected === "fresher" ? "bg-[#FFD700]" : "bg-[#1a1a1a]"
                }`}
              >
                <GraduationCap
                  className={`w-6 h-6 sm:w-8 sm:h-8 ${
                    selected === "fresher" ? "text-black" : "text-gray-400"
                  }`}
                />
              </div>
              <h3 className="text-lg sm:text-2xl font-semibold text-white">
                Fresher
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm max-w-[220px] sm:max-w-xs leading-relaxed">
                Start your career journey and grow with tailored mentorship and
                resources.
              </p>
            </div>
          </div>

          {/* Experienced */}
          <div
            onClick={() => setSelected("experienced")}
            className={`group cursor-pointer p-6 sm:p-8 rounded-2xl border-2 transition-all duration-300 ${
              selected === "experienced"
                ? "border-[#FFD700] bg-[#FFD700]/10 shadow-lg shadow-[#FFD700]/20"
                : "border-[#333] hover:border-[#FFD700]/40 hover:bg-[#111]"
            }`}
          >
            <div className="flex flex-col items-center gap-3 sm:gap-4">
              <div
                className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center ${
                  selected === "experienced" ? "bg-[#FFD700]" : "bg-[#1a1a1a]"
                }`}
              >
                <Briefcase
                  className={`w-6 h-6 sm:w-8 sm:h-8 ${
                    selected === "experienced" ? "text-black" : "text-gray-400"
                  }`}
                />
              </div>
              <h3 className="text-lg sm:text-2xl font-semibold text-white">
                Experienced
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm max-w-[220px] sm:max-w-xs leading-relaxed">
                Bring your experience to new horizons with our advanced platform
                and opportunities.
              </p>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div
          className={`mt-10 sm:mt-12 w-full flex justify-center ${
            isVisible ? "animate-fadeInUp" : "opacity-0"
          }`}
        >
          <button
            onClick={handleContinue}
            disabled={!selected}
            className="flex items-center justify-center gap-2 px-8 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-[#FFD700] to-[#FFC800] text-black font-bold text-base sm:text-lg rounded-xl hover:scale-105 hover:shadow-lg hover:shadow-[#FFD700]/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            Continue
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Footer */}
        <p
          className={`mt-10 sm:mt-12 text-[10px] sm:text-sm text-gray-600 ${
            isVisible ? "animate-fadeInUp" : "opacity-0"
          }`}
        >
          © {new Date().getFullYear()} Jaimax | Powered by{" "}
          <span className="text-[#FFD700]">Jaisvik Software Solutions</span>
        </p>
      </div>
    </div>
  );
}
