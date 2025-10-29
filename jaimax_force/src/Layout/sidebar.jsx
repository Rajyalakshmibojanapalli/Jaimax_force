// import React from "react";
// import { Link, useLocation } from "react-router-dom";
// import {
//   User,
//   CalendarDays,
//   ClipboardCheck,
//   Home,
//   Users,
//   LogOut,
//   ListChecks,
//   UserPlus,
//   UserCheck,
//   Clock,
//   Palmtree,
//   Coins,
//   Bell,
//   MessageSquare,
//   FileText,
//   X,
//   LucideScatterChart,
//   BarChart3,
// } from "lucide-react";
// import LogoutModal from "../pages/authentication/LogoutModal";
// import { useSelector } from "react-redux";

// export default function Sidebar({ isOpen, toggleSidebar }) {
//   const { user } = useSelector((state) => state.auth);
//   const role = user?.role?.toLowerCase() || "null";
//   const location = useLocation();

//   // --- Link class helper ---
//   const linkCls = (path) =>
//     `relative flex items-center gap-3 py-2 px-3 rounded-md transition-all duration-200
//      before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:rounded-r
//      before:bg-[#FFD700] before:scale-y-0 before:transition-transform before:duration-200 hover:before:scale-y-100
//      ${
//        location.pathname === path
//          ? "text-[#FFD700] bg-[#1b1b1b] before:scale-y-100"
//          : "text-gray-300 hover:text-[#FFD700] hover:bg-[#1a1a1a]"
//      }`;

//   // --- Close sidebar on link click (mobile only) ---
//   const handleLinkClick = () => {
//     if (window.innerWidth < 768) toggleSidebar();
//   };

//   return (
//     <>
//       {/* Overlay for mobile */}
//       {isOpen && (
//         <div
//           onClick={toggleSidebar}
//           className="fixed inset-0 bg-black/50 z-20 md:hidden"
//         />
//       )}

//       {/* Sidebar container */}
//       <aside
//         className={`fixed md:static z-30 w-64 h-full bg-[#1a1a1a] border-r border-[#333] flex flex-col transform transition-transform duration-300 ease-in-out
//           ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between p-4 ">
//           <h2 className="text-xl font-bold text-[#FFD700]">
//             Jaimax <span className="text-white">Force</span>
//           </h2>
//           <button
//             onClick={toggleSidebar}
//             className="md:hidden text-gray-400 hover:text-white"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         {/* Scrollable section */}
//         <div
//           className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide"
//           style={{
//             scrollbarWidth: "none", 
//             msOverflowStyle: "none",
//           }}
//         >
//           <style>
//             {`
//               .scrollbar-hide::-webkit-scrollbar {
//                 display: none;
//               }
//             `}
//           </style>

//           <Link to="/dashboard" onClick={handleLinkClick} className={linkCls("/dashboard")}>
//             <Home size={18} /> Dashboard
//           </Link>
//           <Link to="/profile" onClick={handleLinkClick} className={linkCls("/profile")}>
//             <User size={18} /> Profile
//           </Link>
//           <Link to="/onboarding-status" onClick={handleLinkClick} className={linkCls("/onboarding-status")}>
//             <ListChecks size={18} /> Onboarding Status
//           </Link>
//           <Link to="/attendance" onClick={handleLinkClick} className={linkCls("/attendance")}>
//             <CalendarDays size={18} /> Attendance
//           </Link>
//           <Link to="/leaves" onClick={handleLinkClick} className={linkCls("/leaves")}>
//             <ClipboardCheck size={18} /> Leaves
//           </Link>
//           <Link to="/holidays" onClick={handleLinkClick} className={linkCls("/holidays")}>
//             <Palmtree size={18} /> Holidays
//           </Link>
//           <Link to="/pf-insurance" onClick={handleLinkClick} className={linkCls("/pf-insurance")}>
//             <Coins size={18} /> PF & Insurance
//           </Link>
//           <Link to="/payslips" onClick={handleLinkClick} className={linkCls("/payslips")}>
//             <FileText size={18} /> Payslips
//           </Link>

//           {(role === "manager" || role === "admin" || role === "hr") && (
//             <>
//               <Link to="/manager-onboard" onClick={handleLinkClick} className={linkCls("/manager-onboard")}>
//                 <UserPlus size={18} /> Add Employee
//               </Link>
//               <Link to="/all-attendance" onClick={handleLinkClick} className={linkCls("/all-attendance")}>
//             <CalendarDays size={18} /> Team Attendance
//           </Link>
//               <Link to="/all-stats" onClick={handleLinkClick} className={linkCls("/all-stats")}>
//             <BarChart3 size={18} /> Team Monthly Stats
//           </Link>
//               <Link to="/onboard-members" onClick={handleLinkClick} className={linkCls("/onboard-members")}>
//                 <UserCheck size={18} /> Onboarded Members
//               </Link>
//               <Link to="/total-team" onClick={handleLinkClick} className={linkCls("/total-team")}>
//                 <Users size={18} /> Total Team
//               </Link>
//               <Link to="/team-leaves" onClick={handleLinkClick} className={linkCls("/team-leaves")}>
//                 <Users size={18} /> Team Leaves
//               </Link>
//               <Link to="/applied-leaves" onClick={handleLinkClick} className={linkCls("/applied-leaves")}>
//                 <Clock size={18} /> Applied Leaves
//               </Link>
//               <Link to="/notifications" onClick={handleLinkClick} className={linkCls("/notifications")}>
//                 <Bell size={18} /> Notifications
//               </Link>
//             </>
//           )}

//           {role === "employee" && (
//             <Link to="/feedback" onClick={handleLinkClick} className={linkCls("/feedback")}>
//               <MessageSquare size={18} /> Feedback / Complaints
//             </Link>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="px-4 border-t border-[#333]">
//           <div className="flex items-center py-2 px-3 text-red-400 hover:bg-[#222] rounded-md cursor-pointer">
//             <LogOut size={18} />
//             <LogoutModal
//               triggerText="Logout"
//               variant="link"
//               className="text-red-400"
//             />
//           </div>
//         </div>
//       </aside>
//     </>
//   );
// }


import React, {useEffect, useRef} from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  User,
  CalendarDays,
  ClipboardCheck,
  Home,
  Users,
  LogOut,
  ListChecks,
  UserPlus,
  UserCheck,
  Clock,
  Palmtree,
  Coins,
  Bell,
  MessageSquare,
  FileText,
  X,
  BarChart3,
} from "lucide-react";
import LogoutModal from "../pages/authentication/LogoutModal";
import { useSelector } from "react-redux";
import logo from "../assets/images/jForceYellow-1.svg";

export default function Sidebar({ isOpen, toggleSidebar }) {
  const { user, currentMode } = useSelector((state) => state.auth);
  const role = user?.role?.toLowerCase() || "null";
  const location = useLocation();
  const isEmployeeMode = currentMode === "employee";

  const navigate = useNavigate();

// --- track previous mode to detect actual change ---
  const prevModeRef = useRef(currentMode);

  useEffect(() => {
    if (prevModeRef.current !== currentMode) {
      // Only redirect if mode actually changed
      if (location.pathname !== "/dashboard") {
        navigate("/dashboard");
      }
    }
    prevModeRef.current = currentMode;
  }, [currentMode, navigate, location.pathname]);

  // --- Link class helper ---
  const linkCls = (path) =>
    `relative flex items-center gap-3 py-2 px-3 rounded-md transition-all duration-200
     before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:rounded-r
     before:bg-[#FFD700] before:scale-y-0 before:transition-transform before:duration-200 hover:before:scale-y-100
     ${
       location.pathname === path
         ? "text-[#FFD700] bg-[#1b1b1b] before:scale-y-100"
         : "text-gray-300 hover:text-[#FFD700] hover:bg-[#1a1a1a]"
     }`;

  // --- Close sidebar on link click (mobile only) ---
  const handleLinkClick = () => {
    if (window.innerWidth < 768) toggleSidebar();
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed md:static z-30 w-64 h-full bg-[#1a1a1a] border-r border-[#333] flex flex-col transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Header */}
        <div className="flex flex-col items-start justify-between p-4">
          <div className="flex w-full justify-between items-center">
            <img src={logo} alt="Logo" width={180} />
            {/* <h2 className="text-xl font-bold text-[#FFD700]">
              Jaimax <span className="text-white">Force</span>
            </h2> */}
            <button
              onClick={toggleSidebar}
              className="md:hidden text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Show active mode indicator */}
          {role !== "employee" && (
            <p className="text-xs mt-1 text-[#FFD700]/80 italic">
              {isEmployeeMode ? "Employee Mode Active" : `${role.toUpperCase()} Mode`}
            </p>
          )}
        </div>

        {/* Scrollable section */}
        <div
          className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <style>
            {`
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
            `}
          </style>

          {/* === EMPLOYEE MODE === */}
          {(isEmployeeMode || role === "employee") && (
            <>
              <Link
                to="/dashboard"
                onClick={handleLinkClick}
                className={linkCls("/dashboard")}
              >
                <Home size={18} /> Dashboard
              </Link>
              <Link
                to="/profile"
                onClick={handleLinkClick}
                className={linkCls("/profile")}
              >
                <User size={18} /> Profile
              </Link>
              <Link
                to="/onboarding-status"
                onClick={handleLinkClick}
                className={linkCls("/onboarding-status")}
              >
                <ListChecks size={18} /> Onboarding Status
              </Link>
              <Link
                to="/attendance"
                onClick={handleLinkClick}
                className={linkCls("/attendance")}
              >
                <CalendarDays size={18} /> Attendance
              </Link>
              <Link
                to="/leaves"
                onClick={handleLinkClick}
                className={linkCls("/leaves")}
              >
                <ClipboardCheck size={18} /> Leaves
              </Link>
              <Link
                to="/holidays"
                onClick={handleLinkClick}
                className={linkCls("/holidays")}
              >
                <Palmtree size={18} /> Holidays
              </Link>
              <Link
                to="/pf-insurance"
                onClick={handleLinkClick}
                className={linkCls("/pf-insurance")}
              >
                <Coins size={18} /> PF & Insurance
              </Link>
              <Link
                to="/payslips"
                onClick={handleLinkClick}
                className={linkCls("/payslips")}
              >
                <FileText size={18} /> Payslips
              </Link>
              <Link
                to="/feedback"
                onClick={handleLinkClick}
                className={linkCls("/feedback")}
              >
                <MessageSquare size={18} /> Feedback / Complaints
              </Link>
            </>
          )}

          {/* === HR / MANAGER / ADMIN MODE === */}
          {!isEmployeeMode &&
            (role === "manager" || role === "admin" || role === "hr") && (
              <>
              <Link
                to="/dashboard"
                onClick={handleLinkClick}
                className={linkCls("/dashboard")}
              >
                <Home size={18} /> Dashboard
              </Link>
              <Link
                to="/profile"
                onClick={handleLinkClick}
                className={linkCls("/profile")}
              >
                <User size={18} /> Profile
              </Link>
              
                <Link
                  to="/manager-onboard"
                  onClick={handleLinkClick}
                  className={linkCls("/manager-onboard")}
                >
                  <UserPlus size={18} /> Add Employee
                </Link>
                <Link
                  to="/all-attendance"
                  onClick={handleLinkClick}
                  className={linkCls("/all-attendance")}
                >
                  <CalendarDays size={18} /> Team Attendance
                </Link>
                <Link
                  to="/all-stats"
                  onClick={handleLinkClick}
                  className={linkCls("/all-stats")}
                >
                  <BarChart3 size={18} /> Team Monthly Stats
                </Link>
                <Link
                  to="/onboard-members"
                  onClick={handleLinkClick}
                  className={linkCls("/onboard-members")}
                >
                  <UserCheck size={18} /> Onboarded Members
                </Link>
                <Link
                  to="/total-team"
                  onClick={handleLinkClick}
                  className={linkCls("/total-team")}
                >
                  <Users size={18} /> Total Team
                </Link>
                <Link
                  to="/team-leaves"
                  onClick={handleLinkClick}
                  className={linkCls("/team-leaves")}
                >
                  <Users size={18} /> Team Leaves
                </Link>
                <Link
                  to="/applied-leaves"
                  onClick={handleLinkClick}
                  className={linkCls("/applied-leaves")}
                >
                  <Clock size={18} /> Applied Leaves
                </Link>
                <Link
                to="/holidays"
                onClick={handleLinkClick}
                className={linkCls("/holidays")}
              >
                <Palmtree size={18} /> Holidays
              </Link>
                <Link
                  to="/notifications"
                  onClick={handleLinkClick}
                  className={linkCls("/notifications")}
                >
                  <Bell size={18} /> Notifications
                </Link>
              </>
            )}
        </div>

        {/* Footer */}
        <div className="px-4 border-t border-[#333]">
          <div className="flex items-center py-2 px-3 text-red-400 hover:bg-[#222] rounded-md cursor-pointer">
            <LogOut size={18} />
            <LogoutModal
              triggerText="Logout"
              variant="link"
              className="text-red-400"
            />
          </div>
        </div>
      </aside>
    </>
  );
}
