// import React, { useEffect, useState } from "react";
// import {
//   User,
//   CalendarDays,
//   Clock,
//   Briefcase,
//   TrendingUp,
//   CheckCircle2,
//   AlertCircle,
//   BarChart3,
//   ArrowUpRight,
//   Activity,
// } from "lucide-react";
// import { useDispatch, useSelector, useStore } from "react-redux";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useGetProfileQuery } from "../../features/profile/profileApiSlice";
// import { setProfileData } from "../../features/profile/profileSlice";
// import { useGetMonthlyAttendanceStatsQuery } from "../../features/attendance/attendanceApiSlice";
// import { setAttendanceData } from "../../features/attendance/attendanceSlice";
// import {
//   useGetAllLeavesQuery,
//   useGetLeavesSummaryQuery,
//   useGetBalancedLeavesQuery,
// } from "../../features/leaves/leavesApiSlice";
// import {
//   setAllLeaves,
//   setLeaveSummary,
//   setLeaveBalance,
// } from "../../features/leaves/leaveSlice";

// export default function Dashboard() {
//   const user = useSelector((state) => state.auth.user);
//   const role = user?.role || "employee";
//   const username = user?.fullName?.split(" ")[0] || "User";

//   const [time, setTime] = useState(new Date());
//   const [greeting, setGreeting] = useState("");
//   const [mounted, setMounted] = useState(false);

//   const dispatch = useDispatch();
//   const store = useStore();

//   const [rehydrated, setRehydrated] = useState(false);
//   const profile = useSelector((state) => state.profile.data);
//   const lastFetched = useSelector((state) => state.profile.lastFetched);

//   // Detect redux-persist rehydration
//   useEffect(() => {
//     const unsubscribe = store.subscribe(() => {
//       const state = store.getState();
//       if (state?._persist?.rehydrated) {
//         setRehydrated(true);
//         unsubscribe();
//       }
//     });
//   }, [store]);

//   const shouldRefetch =
//     !lastFetched || Date.now() - lastFetched > 24 * 60 * 60 * 1000;

//   // Only fetch when store is rehydrated AND profile is missing/outdated
//   const shouldFetchNow = !profile || shouldRefetch;

//   const { data, isSuccess, isFetching, refetch } = useGetProfileQuery(
//     undefined,
//     {
//       skip: !shouldFetchNow,
//       refetchOnMountOrArgChange: false,
//       refetchOnFocus: true,
//       refetchOnReconnect: true,
//     }
//   );

//   // useEffect(() => {
//   //   if (isFetching) console.log("📡 Fetching profile...");
//   // }, [isFetching]);

//   // Update Redux store once new data arrives
//   useEffect(() => {
//     if (isSuccess && data?.data) {
//       dispatch(setProfileData(data.data));
//     }
//   }, [isSuccess, data, dispatch]);

//   // ---------------- Attendance Sync Logic ----------------

//   const attendance = useSelector((state) => state.attendance.data);
//   const lastAttendanceFetched = useSelector(
//     (state) => state.attendance.lastFetched
//   );

//   const shouldRefetchAttendance =
//     !lastAttendanceFetched ||
//     Date.now() - lastAttendanceFetched > 12 * 60 * 60 * 1000; // every 12 hours

//   const shouldFetchAttendanceNow = !attendance || shouldRefetchAttendance;

//   const now = new Date();
//   const month = now.getMonth() + 1;
//   const year = now.getFullYear();

//   const {
//     data: attendanceData,
//     isSuccess: attendanceSuccess,
//     isFetching: attendanceFetching,
//     refetch: refetchAttendance,
//     isUninitialized,
//   } = useGetMonthlyAttendanceStatsQuery(
//     { userId: user?.id, month, year },
//     {
//       skip: !shouldFetchAttendanceNow || !user?.id,
//       refetchOnMountOrArgChange: false,
//       refetchOnFocus: true,
//       refetchOnReconnect: true,
//     }
//   );

//   // Update Redux store when new data arrives
//   useEffect(() => {
//     if (attendanceSuccess && attendanceData?.data) {
//       dispatch(
//         setAttendanceData({
//           ...attendanceData.data,
//           meta: { month, year }, // store month/year along with stats
//         })
//       );
//     }
//   }, [attendanceSuccess, attendanceData, dispatch, month, year]);

//   // useEffect(() => {
//   //   if (attendanceFetching) console.log("📡 Fetching attendance...");
//   // }, [attendanceFetching]);

//   useEffect(() => {
//     if (!rehydrated || isUninitialized) return;
//     const interval = setInterval(() => {
//       refetchAttendance();
//     }, 12 * 60 * 60 * 1000);

//     return () => clearInterval(interval);
//   }, [rehydrated, refetchAttendance, isUninitialized]);


//   // ---------------- Leaves Sync Logic ----------------
// const leaves = useSelector((state) => state.leaves);
// const lastFetchedLeaves = leaves?.lastFetched || {};

// const shouldRefetchAll =
//   !lastFetchedLeaves.allLeaves ||
//   Date.now() - lastFetchedLeaves.allLeaves > 12 * 60 * 60 * 1000; // 12h

// const shouldRefetchSummary =
//   !lastFetchedLeaves.summary ||
//   Date.now() - lastFetchedLeaves.summary > 12 * 60 * 60 * 1000;

// const shouldRefetchBalance =
//   !lastFetchedLeaves.balance ||
//   Date.now() - lastFetchedLeaves.balance > 12 * 60 * 60 * 1000;

// // --- Queries ---
// const { data: allLeavesData, isSuccess: allLeavesSuccess } =
//   useGetAllLeavesQuery(undefined, { skip: !shouldRefetchAll });

// const { data: summaryData, isSuccess: summarySuccess } =
//   useGetLeavesSummaryQuery(user?.id, { skip: !shouldRefetchSummary || !user?.id });

// const { data: balanceData, isSuccess: balanceSuccess } =
//   useGetBalancedLeavesQuery(user?.id, { skip: !shouldRefetchBalance || !user?.id });

// // --- Store updates ---
// useEffect(() => {
//   if (allLeavesSuccess && allLeavesData?.data) {
//     dispatch(setAllLeaves(allLeavesData.data));
//   }
// }, [allLeavesSuccess, allLeavesData, dispatch]);

// useEffect(() => {
//   if (summarySuccess && summaryData?.data) {
//     dispatch(setLeaveSummary(summaryData.data));
//   }
// }, [summarySuccess, summaryData, dispatch]);

// useEffect(() => {
//   if (balanceSuccess && balanceData?.data) {
//     dispatch(setLeaveBalance(balanceData.data));
//   }
// }, [balanceSuccess, balanceData, dispatch]);


//   useEffect(() => {
//     setMounted(true);
//     const timer = setInterval(() => setTime(new Date()), 1000);
//     return () => clearInterval(timer);
//   }, []);

//   useEffect(() => {
//     const h = time.getHours();
//     if (h < 12) setGreeting("Good Morning");
//     else if (h < 17) setGreeting("Good Afternoon");
//     else setGreeting("Good Evening");
//   }, [time]);

//   useEffect(() => {
//     if (!greeting) return;
//     const today = new Date().toDateString();
//     const lastToast = sessionStorage.getItem("dashboardToast");
//     if (lastToast !== today) {
//       setTimeout(() => {
//         toast.success(`${greeting}, ${username}! Welcome back.`, {
//           position: "top-right",
//           autoClose: 2500,
//           theme: "dark",
//         });
//         sessionStorage.setItem("dashboardToast", today);
//       }, 500);
//     }
//   }, [greeting, username]);


//   const stats = [
//     {
//       title: "Attendance Rate",
//       value: "84.6%",
//       change: "+2.1%",
//       trend: "up",
//       icon: <CalendarDays size={20} strokeWidth={1.8} />,
//       detail: "22 of 26 days present",
//       color: "emerald",
//     },
//     {
//       title: "Leave Balance",
//       value: "18",
//       change: "2 used",
//       trend: "neutral",
//       icon: <Clock size={20} strokeWidth={1.8} />,
//       detail: "days remaining this year",
//       color: "blue",
//     },
//     {
//       title: "Active Projects",
//       value: "5",
//       change: "+1 new",
//       trend: "up",
//       icon: <Briefcase size={20} strokeWidth={1.8} />,
//       detail: "currently in progress",
//       color: "purple",
//     },
//     {
//       title: "Performance Score",
//       value: "92%",
//       change: "+5.2%",
//       trend: "up",
//       icon: <BarChart3 size={20} strokeWidth={1.8} />,
//       detail: "quarterly evaluation",
//       color: "yellow",
//     },
//   ];

//   const formattedTime = time.toLocaleTimeString("en-IN", {
//     hour: "2-digit",
//     minute: "2-digit",
//   });
//   const formattedDate = time.toLocaleDateString("en-IN", {
//     weekday: "long",
//     month: "long",
//     day: "numeric",
//     year: "numeric",
//   });

//   if (!user) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-black">
//         <div className="flex flex-col items-center gap-4">
//           <div className="relative w-12 h-12">
//             <div className="absolute inset-0 border-2 border-[#FFD700]/20 rounded-full"></div>
//             <div className="absolute inset-0 border-2 border-t-[#FFD700] rounded-full animate-spin"></div>
//           </div>
//           <p className="text-sm text-gray-500">Loading dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-black text-white">
//       <ToastContainer />

//       {/* Sophisticated background */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FFD700] opacity-[0.03] blur-[120px] rounded-full"></div>
//         <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#FFD700] opacity-[0.02] blur-[100px] rounded-full"></div>
//         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,215,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,215,0,0.03)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,black,transparent)]"></div>
//       </div>

//       <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-8 py-10">
//         {/* Header Section */}
//         <header
//           className={`mb-12 transition-all duration-700 ${
//             mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
//           }`}
//         >
//           <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
//             <div className="flex-1">
//               <h1 className="text-4xl lg:text-4xl font-light mb-3 tracking-tight">
//                 {greeting},{" "}
//                 <span className="font-semibold text-[#FFD700]">{username}</span>
//               </h1>

//               <p className="text-sm text-gray-500 font-light">
//                 {formattedDate} &nbsp; {formattedTime}
//               </p>
//             </div>
//           </div>
//         </header>

//         {/* Stats Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
//           {stats.map((stat, i) => (
//             <div
//               key={i}
//               className={`group relative transition-all duration-500 ${
//                 mounted
//                   ? "opacity-100 translate-y-0"
//                   : "opacity-0 translate-y-4"
//               }`}
//               style={{ transitionDelay: `${i * 100}ms` }}
//             >
//               <div className="absolute -inset-0.5 bg-gradient-to-br from-[#FFD700]/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-500"></div>
//               <div className="relative h-full p-6 rounded-2xl bg-[#0a0a0a] border border-[#1a1a1a] hover:border-[#FFD700]/30 transition-all duration-300">
//                 <div className="flex items-start justify-between mb-6">
//                   <div className="p-2.5 rounded-xl bg-[#FFD700]/5 text-[#FFD700] group-hover:bg-[#FFD700]/10 transition-colors">
//                     {stat.icon}
//                   </div>
//                   {stat.trend === "up" && (
//                     <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20">
//                       <TrendingUp size={11} className="text-emerald-400" />
//                       <span className="text-[10px] font-medium text-emerald-400">
//                         {stat.change}
//                       </span>
//                     </div>
//                   )}
//                   {stat.trend === "neutral" && (
//                     <span className="text-[10px] text-gray-500 px-2 py-1 rounded-md bg-gray-500/5">
//                       {stat.change}
//                     </span>
//                   )}
//                 </div>

//                 <div className="space-y-1">
//                   <h3 className="text-4xl font-light text-white tracking-tight">
//                     {stat.value}
//                   </h3>
//                   <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
//                     {stat.title}
//                   </p>
//                   <p className="text-xs text-gray-600 leading-relaxed">
//                     {stat.detail}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Role-Based Section */}
//         <div
//           className={`mb-12 transition-all duration-700 delay-300 ${
//             mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
//           }`}
//         >
//           {role === "admin" && (
//             <RoleSection
//               icon={<User size={28} strokeWidth={1.5} />}
//               title="Administrative Control Panel"
//               desc="Comprehensive system management with advanced analytics, user administration, and security configuration. Maintain operational excellence across all departments."
//               features={[
//                 {
//                   label: "User Management",
//                   desc: "Create, modify, and manage user accounts",
//                 },
//                 {
//                   label: "System Analytics",
//                   desc: "Real-time insights and reporting",
//                 },
//                 {
//                   label: "Security Settings",
//                   desc: "Advanced access controls",
//                 },
//                 { label: "Configuration", desc: "System-wide preferences" },
//               ]}
//             />
//           )}

//           {(role === "manager" || role === "hr") && (
//             <RoleSection
//               icon={<Briefcase size={28} strokeWidth={1.5} />}
//               title="Team Management Hub"
//               desc="Streamline team operations with approval workflows, performance tracking, and comprehensive reporting tools. Drive productivity and team success."
//               features={[
//                 {
//                   label: "Leave Approvals",
//                   desc: "Review and process requests",
//                 },
//                 { label: "Performance Tracking", desc: "Monitor team metrics" },
//                 { label: "Team Reports", desc: "Generate insights" },
//                 { label: "Onboarding", desc: "New employee setup" },
//               ]}
//             />
//           )}

//           {role === "employee" && (
//             <RoleSection
//               icon={<User size={28} strokeWidth={1.5} />}
//               title="Personal Workspace"
//               desc="Manage your daily activities, track attendance, submit leave requests, and monitor your performance metrics. Stay organized and productive."
//               features={[
//                 { label: "Attendance Log", desc: "Track your daily presence" },
//                 {
//                   label: "Leave Requests",
//                   desc: "Submit and monitor requests",
//                 },
//                 { label: "Project Updates", desc: "Log progress and tasks" },
//                 { label: "Timesheets", desc: "Record work hours" },
//               ]}
//             />
//           )}
//         </div>

//         {/* Activity Summary */}
//         <div
//           className={`grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12 transition-all duration-700 delay-500 ${
//             mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
//           }`}
//         >
//           <ActivityCard
//             title="This Week"
//             value="5/5"
//             subtitle="Days attended"
//             icon={<CheckCircle2 size={18} />}
//             iconColor="text-emerald-400"
//             bgColor="bg-emerald-500/5"
//           />
//           <ActivityCard
//             title="Today"
//             value="8.5h"
//             subtitle="Working hours"
//             icon={<Clock size={18} />}
//             iconColor="text-[#FFD700]"
//             bgColor="bg-[#FFD700]/5"
//           />
//           <ActivityCard
//             title="Status"
//             value="Active"
//             subtitle="Current status"
//             icon={<Activity size={18} />}
//             iconColor="text-blue-400"
//             bgColor="bg-blue-500/5"
//           />
//         </div>

//         {/* Footer */}
//         <footer className="pt-8 border-t border-[#1a1a1a]">
//           <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600">
//             <p>
//               Last synchronized:{" "}
//               {time.toLocaleString("en-IN", {
//                 hour: "2-digit",
//                 minute: "2-digit",
//                 second: "2-digit",
//               })}
//             </p>
//             <p className="text-gray-700">© 2025 Enterprise Management System</p>
//           </div>
//         </footer>
//       </div>
//     </div>
//   );
// }

// function RoleSection({ icon, title, desc, features }) {
//   return (
//     <div className="group relative">
//       <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FFD700]/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-700"></div>
//       <div className="relative p-8 rounded-2xl bg-[#0a0a0a] border border-[#1a1a1a] hover:border-[#FFD700]/20 transition-all duration-500">
//         <div className="flex flex-col lg:flex-row gap-8">
//           <div className="flex-shrink-0">
//             <div className="p-4 rounded-2xl bg-[#FFD700]/5 text-[#FFD700] border border-[#FFD700]/10 group-hover:bg-[#FFD700]/10 transition-colors">
//               {icon}
//             </div>
//           </div>

//           <div className="flex-1 space-y-6">
//             <div>
//               <h2 className="text-2xl font-light mb-3 text-white">{title}</h2>
//               <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               {features.map((feature, idx) => (
//                 <div
//                   key={idx}
//                   className="group/item flex items-start gap-3 p-4 rounded-xl bg-[#0f0f0f] border border-[#1a1a1a] hover:border-[#FFD700]/20 transition-all duration-300"
//                 >
//                   <ArrowUpRight
//                     size={14}
//                     className="text-[#FFD700] mt-0.5 flex-shrink-0 group-hover/item:translate-x-0.5 group-hover/item:-translate-y-0.5 transition-transform"
//                     strokeWidth={2}
//                   />
//                   <div>
//                     <p className="text-sm font-medium text-white mb-1">
//                       {feature.label}
//                     </p>
//                     <p className="text-xs text-gray-600 leading-relaxed">
//                       {feature.desc}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function ActivityCard({ title, value, subtitle, icon, iconColor, bgColor }) {
//   return (
//     <div className="group relative">
//       <div className="absolute -inset-0.5 bg-gradient-to-br from-[#FFD700]/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-500"></div>
//       <div className="relative p-6 rounded-2xl bg-[#0a0a0a] border border-[#1a1a1a] hover:border-[#FFD700]/20 transition-all duration-300">
//         <div className="flex items-start justify-between mb-4">
//           <span className="text-[10px] font-medium text-gray-500 uppercase tracking-[0.15em]">
//             {title}
//           </span>
//           <div className={`p-2 rounded-lg ${bgColor} ${iconColor}`}>{icon}</div>
//         </div>

//         <div className="space-y-1">
//           <p className="text-3xl font-light text-white tracking-tight">
//             {value}
//           </p>
//           <p className="text-xs text-gray-600">{subtitle}</p>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import {
  User,
  CalendarDays,
  Clock,
  CheckCircle2,
  AlertCircle,
  Activity,
  Layers,
  XCircle,
  Briefcase,
  PieChart,
  Calendar,
} from "lucide-react";
import { useDispatch, useSelector, useStore } from "react-redux";
import { ResponsiveContainer, AreaChart, Area } from "recharts";
import { toast, ToastContainer } from "../../features/helpers/Toaster";
import "react-toastify/dist/ReactToastify.css";
import { useGetProfileQuery } from "../../features/profile/profileApiSlice";
import { setProfileData } from "../../features/profile/profileSlice";
import { useGetMonthlyAttendanceStatsQuery } from "../../features/attendance/attendanceApiSlice";
import { setAttendanceData } from "../../features/attendance/attendanceSlice";
import {
  useGetAllLeavesQuery,
  useGetLeavesSummaryQuery,
  useGetBalancedLeavesQuery,
} from "../../features/leaves/leavesApiSlice";
import {
  setAllLeaves,
  setLeaveSummary,
  setLeaveBalance,
  setLeaveUser,
} from "../../features/leaves/leaveSlice";
import { motion } from "framer-motion";
import { useGetHolidaysQuery } from "../../features/holidays/holidayApiSlice";
import { setHolidaysData } from "../../features/holidays/holidaySlice";

export default function Dashboard() {
  const user = useSelector((state) => state.auth.user);
  const role = user?.role || "employee";
  const username = user?.fullName?.split(" ")[0] || "User";

  const [time, setTime] = useState(new Date());
  const [greeting, setGreeting] = useState("");
  const [mounted, setMounted] = useState(false);
  const dispatch = useDispatch();
  const store = useStore();

  // detect redux-persist hydration
  const [rehydrated, setRehydrated] = useState(false);
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const state = store.getState();
      if (state?._persist?.rehydrated) {
        setRehydrated(true);
        unsubscribe();
      }
    });
  }, [store]);

  // ---------------- Profile ----------------
  const profile = useSelector((state) => state.profile.data);
  const lastFetched = useSelector((state) => state.profile.lastFetched);
  const shouldRefetch = !lastFetched || Date.now() - lastFetched > 60 * 1000;
  const shouldFetchNow = !profile || shouldRefetch;

  const { data, isSuccess, refetch: profileRefech, isUninitialized: profileIntialisation } = useGetProfileQuery(undefined, {
    skip: !shouldFetchNow,
    refetchOnMountOrArgChange: false,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  useEffect(() => {
    if (isSuccess && data?.data) dispatch(setProfileData(data.data));
  }, [isSuccess, data, dispatch]);

   useEffect(() => {
    if (!rehydrated || profileIntialisation) return;
    const interval = setInterval(() => profileRefech(), 60 * 1000);
    return () => clearInterval(interval);
  }, [rehydrated, profileRefech, profileIntialisation]);

  // ---------------- Attendance ----------------
  const attendance = useSelector((state) => state.attendance.data);
  const lastAttendanceFetched = useSelector((state) => state.attendance.lastFetched);

  const shouldRefetchAttendance =
    !lastAttendanceFetched || Date.now() - lastAttendanceFetched > 12 * 60 * 60 * 1000;
  const shouldFetchAttendanceNow = !attendance || shouldRefetchAttendance;

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const {
    data: attendanceData,
    isSuccess: attendanceSuccess,
    refetch: refetchAttendance,
    isUninitialized,
  } = useGetMonthlyAttendanceStatsQuery(
    { userId: user?.id, month, year },
    {
      skip: !shouldFetchAttendanceNow || !user?.id,
      refetchOnMountOrArgChange: false,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }
  );

  useEffect(() => {
    if (attendanceSuccess && attendanceData?.data) {
      dispatch(
        setAttendanceData({
          ...attendanceData.data,
          meta: { month, year },
        })
      );
    }
  }, [attendanceSuccess, attendanceData, dispatch, month, year]);

  useEffect(() => {
    if (!rehydrated || isUninitialized) return;
    const interval = setInterval(() => refetchAttendance(), 1 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [rehydrated, refetchAttendance, isUninitialized]);


  // ---------------- Leaves ----------------

  const leaves = useSelector((state) => state.leaves);
  const lastFetchedLeaves = leaves?.lastFetched || {};

  // Ensure slice matches current user
  useEffect(() => {
    if (user?.id) dispatch(setLeaveUser(user.id));
  }, [user?.id, dispatch]);

  // Refetch condition (1 hour)
  const REFRESH_INTERVAL = 60 * 1000;
  const shouldRefetchAll =
    !lastFetchedLeaves.allLeaves ||
    Date.now() - lastFetched?.allLeaves > REFRESH_INTERVAL;
  const shouldRefetchSummary =
    !lastFetchedLeaves.summary ||
    Date.now() - lastFetched?.summary > REFRESH_INTERVAL;
  const shouldRefetchBalance =
    !lastFetchedLeaves.balance ||
    Date.now() - lastFetched?.balance > REFRESH_INTERVAL;

  // Queries
  const {
    data: allLeavesData,
    isSuccess: allLeavesSuccess,
    refetch: refetchAllLeaves,
    isUninitialized: isAllUninit,
  } = useGetAllLeavesQuery(undefined, {
    skip: !shouldRefetchAll || !user?.id,
  });

  const {
    data: summaryData,
    isSuccess: summarySuccess,
    refetch: refetchSummary,
    isUninitialized: isSummaryUninit,
  } = useGetLeavesSummaryQuery(user?.id, {
    skip: !shouldRefetchSummary || !user?.id,
  });

  const {
    data: balanceData,
    isSuccess: balanceSuccess,
    refetch: refetchBalance,
    isUninitialized: isBalanceUninit,
  } = useGetBalancedLeavesQuery(user?.id, {
    skip: !shouldRefetchBalance || !user?.id,
  });

  // Store in Redux
  useEffect(() => {
    if (allLeavesSuccess && allLeavesData?.data)
      dispatch(setAllLeaves(allLeavesData.data));
  }, [allLeavesSuccess, allLeavesData, dispatch]);

  useEffect(() => {
    if (summarySuccess && summaryData?.data)
      dispatch(setLeaveSummary(summaryData.data));
  }, [summarySuccess, summaryData, dispatch]);

  useEffect(() => {
    if (balanceSuccess && balanceData?.data)
      dispatch(setLeaveBalance(balanceData.data));
  }, [balanceSuccess, balanceData, dispatch]);

  // Background re-fetch every 1 hour (silent)
  useEffect(() => {
  if (isAllUninit && isSummaryUninit && isBalanceUninit) return;
  const interval = setInterval(() => {
    refetchAllLeaves();
    refetchSummary();
    refetchBalance();
  }, 60 * 1000);
  return () => clearInterval(interval);
}, [
  refetchAllLeaves,
  refetchSummary,
  refetchBalance,
  isAllUninit,
  isSummaryUninit,
  isBalanceUninit,
]);

// console.log(allLeavesData)

//------------------ holidays ------------------------

const holidays = useSelector((state) => state.holidays);
const lastHolidaysFetched = useSelector((state) => state.holidays.lastFetched);

const currentYear = now.getFullYear();
// console.log(currentYear);
const shouldRefetchHolidays =
  !lastHolidaysFetched || Date.now() - lastHolidaysFetched > 1 * 60 * 60 * 1000;
const shouldFetchHolidaysNow = !holidays || shouldRefetchHolidays;

const {
  data: holidaysData,
  isSuccess: holidaysSuccess,
  refetch: refetchHolidays,
  isUninitialized: holidaysUninitialized,
} = useGetHolidaysQuery(currentYear, {
  skip: !shouldFetchHolidaysNow,
  refetchOnMountOrArgChange: false,
  refetchOnFocus: true,
  refetchOnReconnect: true,
});

useEffect(() => {
  if (holidaysSuccess && holidaysData?.data) {
    dispatch(setHolidaysData(holidaysData.data));
  }
}, [holidaysSuccess, holidaysData, dispatch]);

// Silent background refetch every 1h
useEffect(() => {
  if (!rehydrated || holidaysUninitialized) return;
  const interval = setInterval(() => refetchHolidays(), 1 * 60 * 60 * 1000);
  return () => clearInterval(interval);
}, [rehydrated, refetchHolidays, holidaysUninitialized]);

// console.log(holidays);

  // ---------------- Time & Greeting ----------------
 useEffect(() => {
    const h = time.getHours();
    if (h < 12) setGreeting("Good Morning");
    else if (h < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, [time]);
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const today = new Date().toDateString();
    const lastToast = sessionStorage.getItem("dashboardToast");
    if (lastToast !== today) {
      toast.success(`${greeting}, ${username}! Welcome back.`, {
        position: "top-right",
        autoClose: 2500,
        theme: "dark",
      });
      sessionStorage.setItem("dashboardToast", today);
    }
  }, [greeting, username]);

  // const attendance = useSelector((state) => state.attendance.data);
  const persistedAttendance = attendance?.stats || attendanceData?.data?.stats || {};
  const workingDays = persistedAttendance?.workingDays ?? 20;
  const presentDays = persistedAttendance?.presentDays ?? 18;
  const totalDays = persistedAttendance?.totalDays ?? 31;
  const presentPercent = workingDays
    ? Math.round((presentDays / workingDays) * 100)
    : 0;

  const balanceObj =
    balanceData?.data?.leaveBalance ||
    attendance?.leaveBalance ||
    {};

    // console.log(balanceObj)

  const leavesSummary = leaves.summary?.summary || {};

  // console.log(leavesSummary);
  
  const leaveTypes = [
    { key: "privilege", label: "Privilege" },
    { key: "casual", label: "Casual" },
    { key: "sick", label: "Sick" },
    { key: "maternity", label: "Maternity" },
    { key: "paternity", label: "Paternity" },
  ];

  const formattedDate = time.toLocaleDateString("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const formattedTime = time.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
  const cardVariant = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white w-full overflow-x-hidden">
      <ToastContainer />
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-8 right-8 w-[480px] h-[480px] bg-[#FFD700] opacity-[0.02] blur-[120px] rounded-full" />
        <div className="absolute bottom-8 left-8 w-[340px] h-[340px] bg-[#FFD700] opacity-[0.015] blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between md:flex-col md:items-start md:justify-between lg:flex-row gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-light mb-1">
                {greeting},{" "}
                <span className="font-semibold text-[#FFD700]">{username}</span>
              </h1>
              <p className="text-sm text-gray-400">{formattedDate} • {formattedTime}</p>
            </div>

            <div className="rounded-2xl bg-gradient-to-b from-[#141414] to-[#0b0b0b] p-4 border border-[#2c2c2c] flex flex-row items-center gap-4 w-full sm:w-auto sm:min-w-[280px]">
              <div className="flex items-center gap-2 flex-1">
                <Layers size={18} className="text-[#FFD700]" />
                <div>
                  <div className="text-xs text-gray-400">Role</div>
                  <div className="text-sm font-medium">{role}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-1">
                <User size={18} className="text-[#18a04a]" />
                <div>
                  <div className="text-xs text-gray-400">Employee</div>
                  <div className="text-sm font-medium truncate">
                    {user?.employeeId ?? user?.id}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Stats */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-1 gap-3 mb-10"
        >
          {/* Attendance */}
          <motion.div variants={cardVariant}>
            <div className="rounded-2xl p-6 bg-gradient-to-b from-[#121212] to-[#0a0a0a] border border-[#2a2a2a] shadow-lg hover:border-[#FFD700]/40 transition-all">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-3 rounded-lg bg-[#FFD700]/10 text-[#FFD700]">
                  <CalendarDays size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#FFD700]">Attendance Summary</h3>
                  <p className="text-xs text-gray-400">
                    Month: {month}/{year}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="relative w-36 h-36 sm:w-44 sm:h-44 mx-auto mt-2">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <defs>
                      <linearGradient id="gradGold" x1="0" x2="1">
                        <stop offset="0%" stopColor="#FFD700" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#FFD700" stopOpacity="0.5" />
                      </linearGradient>
                    </defs>
                    <circle cx="50" cy="50" r="44" stroke="#1f1f1f" strokeWidth="10" fill="none" />
                    <circle
                      cx="50"
                      cy="50"
                      r="44"
                      stroke="url(#gradGold)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${(presentPercent / 100) * 276} 276`}
                      transform="rotate(-90 50 50)"
                      fill="none"
                      className="drop-shadow-[0_0_12px_rgba(255,215,0,0.3)]"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-2xl font-semibold text-[#FFD700]">{presentPercent}%</div>
                    <div className="text-xs text-gray-400">Present</div>
                  </div>
                </div>

                <div className="mt-10 w-full grid grid-cols-3 gap-2 text-xs">
                  <MiniInfo title="Working" value={workingDays} />
                  <MiniInfo title="Present" value={presentDays} />
                  <MiniInfo title="Total" value={totalDays} />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Leave Balance */}
          <motion.div variants={cardVariant}>
            <div className="rounded-2xl p-6 bg-gradient-to-b from-[#121212] to-[#0a0a0a] border border-[#2a2a2a] shadow-lg hover:border-emerald-500/30 transition-all">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Clock size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-emerald-400">Leave Balances</h3>
                  <p className="text-xs text-gray-400">Available counts & totals</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {leaveTypes.map((lt) => {
                  const total = balanceObj?.[`total${lt.key}`] ?? 0;
                  const available = balanceObj?.[`${lt.key}Leave`] ?? 0;
                  return (
                    <div
                      key={lt.key}
                      className="flex items-center justify-between p-3 rounded-xl bg-[#0d0d0d] border border-[#1a1a1a] hover:border-emerald-400/20 transition-all"
                    >
                      <div className="flex items-center gap-2 text-sm">
                        <Briefcase size={15} className="text-emerald-400" />
                        <span>{lt.label}</span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {available}/{total}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Summary */}
        <motion.div variants={container} initial="hidden" animate="show" className="mb-12">
          <motion.div variants={cardVariant}>
            <div className="rounded-2xl p-6 bg-gradient-to-b from-[#121212] to-[#0a0a0a] border border-[#2a2a2a] shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-[#FFD700]">
                  <PieChart size={16} /> Leaves Summary
                </h3>
                <div className="text-xs text-gray-400">Year: {year}</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <SummaryTile
                  title="Approved"
                  value={leavesSummary?.approved ?? 0}
                  icon={<CheckCircle2 className="text-emerald-400" />}
                />
                <SummaryTile
                  title="Pending"
                  value={leavesSummary?.pending ?? 0}
                  icon={<Clock className="text-amber-400" />}
                />
                <SummaryTile
                  title="Rejected"
                  value={leavesSummary?.rejected ?? 0}
                  icon={<XCircle className="text-rose-400" />}
                />
                <SummaryTile
                  title="Total Days"
                  value={leavesSummary?.totalDaysTaken ?? 0}
                  icon={<Activity className="text-blue-400" />}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <footer className="pt-6 border-t border-[#1a1a1a] text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
            <p>
              Last synchronized:{" "}
              {time.toLocaleString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </p>
            <p className="text-gray-500">© 2025 Enterprise Management System</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

/* Subcomponents */
function MiniInfo({ title, value }) {
  return (
    <div className="p-2 rounded-lg bg-[#0b0b0b] border border-[#2c2c2c] text-center">
      <div className="text-[11px] text-gray-400">{title}</div>
      <div className="text-sm font-medium text-white">{value}</div>
    </div>
  );
}

function SummaryTile({ title, value, icon }) {
  return (
    <div className="p-4 rounded-lg bg-[#0b0b0b] border border-[#2c2c2c] flex items-center justify-between hover:border-[#FFD700]/20 transition-all">
      <div>
        <div className="text-xs text-gray-400">{title}</div>
        <div className="text-xl font-semibold mt-2 text-white">{value}</div>
      </div>
      {icon}
    </div>
  );
}