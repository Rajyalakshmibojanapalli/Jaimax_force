import React from "react";
import { Menu } from "lucide-react";
import LogoutModal from "../pages/authentication/LogoutModal";
import { useSelector } from "react-redux";

export default function Navbar({ toggleSidebar }) {
  const { user } = useSelector((state) => state.auth);

  return (
    <header className="bg-[#1a1a1a] border-b border-[#222] px-4 py-3.5 flex justify-between items-center shadow-md">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-[#1e1e1e] focus:outline-none md:hidden"
        >
          <Menu size={22} className="text-[#FFD700]" />
        </button>

        <h1 className="font-semibold text-white text-lg">
          <span className="hidden sm:inline">
            Welcome, <span className="text-[#FFD700]">{user?.fullName || "User"}</span>
          </span>
          <span className="inline sm:hidden text-white font-bold">Jai<span className="text-[#FFD700]">max</span></span>
        </h1>
      </div>

      <div className="flex-shrink-0">
        <div className="hidden xs:block">
          <LogoutModal triggerText="Logout" variant="button" />
        </div>
        <div className="block xs:hidden">
          <LogoutModal
            triggerText="Logout"
            variant="button"
            className="!px-2 !py-1 text-sm !text-[#fff] !border-[#FFD700]/50 hover:!border-[#FFD700]"
          />
        </div>
      </div>
    </header>
  );
}
