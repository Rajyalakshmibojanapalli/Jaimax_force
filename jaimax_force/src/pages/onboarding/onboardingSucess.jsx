import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function OnboardingSuccess() {
  const navigate = useNavigate();

  const handleExit = () => {
    localStorage.removeItem("onboardToken");
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white text-center px-4 sm:px-6 md:px-8 relative">
      <CheckCircle className="w-16 h-16 sm:w-20 sm:h-20 text-[#35c46a] mb-4 sm:mb-6" />
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#FFD700] mb-3 sm:mb-4">
        Onboarding Completed!
      </h1>
      <p className="text-gray-300 text-sm sm:text-base md:text-lg max-w-xs sm:max-w-md md:max-w-lg mb-4 sm:mb-6 px-2">
        Congratulations! You’ve successfully submitted all your details. Welcome
        to{" "}
        <span className="text-[#FFD700] font-semibold whitespace-nowrap">
          Jaimax
        </span>
        .
      </p>
      <p className="text-gray-400 text-xs sm:text-sm md:text-base mb-6 sm:mb-10 px-3 max-w-sm sm:max-w-md md:max-w-lg leading-relaxed">
        You can safely exit this page now. Your manager will review and activate
        your profile shortly.
      </p>

      <button
        onClick={handleExit}
        className="px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 bg-gradient-to-r from-[#FFD700] to-[#FFC800] text-black font-bold rounded-lg hover:scale-105 active:scale-95 transition-all duration-200 text-sm sm:text-base"
      >
        Exit
      </button>
      <footer className="absolute bottom-4 sm:bottom-6 text-[10px] sm:text-xs text-gray-600 text-center px-4">
        © {new Date().getFullYear()} Jaimax | Powered by{" "}
        <span className="text-[#FFD700]">Jaisvik Software Solutions</span>
      </footer>
    </div>
  );
}
