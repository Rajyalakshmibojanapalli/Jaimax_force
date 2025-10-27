// import React from "react";
// import { Menu } from "lucide-react";
// import LogoutModal from "../pages/authentication/LogoutModal";
// import { useSelector } from "react-redux";

// export default function Navbar({ toggleSidebar }) {
//   const { user } = useSelector((state) => state.auth);

//   return (
//     <header className="bg-[#1a1a1a] border-b border-[#222] px-4 py-3.5 flex justify-between items-center shadow-md">
//       <div className="flex items-center gap-3">
//         <button
//           onClick={toggleSidebar}
//           className="p-2 rounded-md hover:bg-[#1e1e1e] focus:outline-none md:hidden"
//         >
//           <Menu size={22} className="text-[#FFD700]" />
//         </button>

//         <h1 className="font-semibold text-white text-lg">
//           <span className="hidden sm:inline">
//             Welcome, <span className="text-[#FFD700]">{user?.fullName || "User"}</span>
//           </span>
//           <span className="inline sm:hidden text-white font-bold">Jai<span className="text-[#FFD700]">max</span></span>
//         </h1>
//       </div>

//       <div className="flex-shrink-0">
//         <div className="hidden xs:block">
//           <LogoutModal triggerText="Logout" variant="button" />
//         </div>
//         <div className="block xs:hidden">
//           <LogoutModal
//             triggerText="Logout"
//             variant="button"
//             className="!px-2 !py-1 text-sm !text-[#fff] !border-[#FFD700]/50 hover:!border-[#FFD700]"
//           />
//         </div>
//       </div>
//     </header>
//   );
// }


import React from "react";
import { Menu } from "lucide-react";
import LogoutModal from "../pages/authentication/LogoutModal";
import { useSelector, useDispatch } from "react-redux";
import { toggleUserMode } from "../features/auth/authSlice";

export default function Navbar({ toggleSidebar }) {
  const dispatch = useDispatch();
  const { user, currentMode } = useSelector((state) => state.auth);

  const isEmployeeMode = currentMode === "employee";

  return (
    <header className="bg-[#1a1a1a] border-b border-[#222] px-4 py-3.5 flex justify-between items-center shadow-md">
      {/* === Left Section === */}
      <div className="flex items-center gap-3">
        {/* Sidebar Toggle (Mobile) */}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-[#1e1e1e] focus:outline-none md:hidden"
        >
          <Menu size={22} className="text-[#FFD700]" />
        </button>

        {/* Greeting / Brand */}
        <h1 className="font-semibold text-white text-lg">
          <span className="hidden sm:inline">
            Welcome,&nbsp;
            <span className="text-[#FFD700]">
              {user?.fullName || "User"}
            </span>
          </span>
          <span className="inline sm:hidden text-white font-bold">
            Jai<span className="text-[#FFD700]">max</span>
          </span>
        </h1>
      </div>

      {/* === Right Section === */}
      <div className="flex items-center gap-4">
        {/* --- Role Switcher (only for HR, Admin, Manager) --- */}
        {(user?.role === "admin" ||
          user?.role === "hr" ||
          user?.role === "manager") && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 hidden sm:inline">
              {isEmployeeMode ? "Employee Mode" : "Role Mode"}
            </span>

            {/* Toggle Switch */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isEmployeeMode}
                onChange={() => dispatch(toggleUserMode())}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:bg-[#FFD700] transition-all duration-300"></div>
              <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 peer-checked:translate-x-5"></span>
            </label>
          </div>
        )}

        {/* Logout Button */}
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
      </div>
    </header>
  );
}
