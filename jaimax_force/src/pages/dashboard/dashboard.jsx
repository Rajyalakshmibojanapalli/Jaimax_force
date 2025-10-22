import React, { useEffect, useState } from "react";
import {
  User,
  CalendarDays,
  Clock,
  Briefcase,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  ArrowUpRight,
  Activity,
} from "lucide-react";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Dashboard() {
  const user = useSelector((state) => state.auth.user);
  const role = user?.role || "employee";
  const username = user?.fullName?.split(" ")[0] || "User";

  const [time, setTime] = useState(new Date());
  const [greeting, setGreeting] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const h = time.getHours();
    if (h < 12) setGreeting("Good Morning");
    else if (h < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, [time]);

  useEffect(() => {
    if (!greeting) return;
    const today = new Date().toDateString();
    const lastToast = sessionStorage.getItem("dashboardToast");
    if (lastToast !== today) {
      setTimeout(() => {
        toast.success(`${greeting}, ${username}! Welcome back.`, {
          position: "top-right",
          autoClose: 2500,
          theme: "dark",
        });
        sessionStorage.setItem("dashboardToast", today);
      }, 500);
    }
  }, [greeting, username]);

  const stats = [
    {
      title: "Attendance Rate",
      value: "84.6%",
      change: "+2.1%",
      trend: "up",
      icon: <CalendarDays size={20} strokeWidth={1.8} />,
      detail: "22 of 26 days present",
      color: "emerald",
    },
    {
      title: "Leave Balance",
      value: "18",
      change: "2 used",
      trend: "neutral",
      icon: <Clock size={20} strokeWidth={1.8} />,
      detail: "days remaining this year",
      color: "blue",
    },
    {
      title: "Active Projects",
      value: "5",
      change: "+1 new",
      trend: "up",
      icon: <Briefcase size={20} strokeWidth={1.8} />,
      detail: "currently in progress",
      color: "purple",
    },
    {
      title: "Performance Score",
      value: "92%",
      change: "+5.2%",
      trend: "up",
      icon: <BarChart3 size={20} strokeWidth={1.8} />,
      detail: "quarterly evaluation",
      color: "yellow",
    },
  ];

  const formattedTime = time.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const formattedDate = time.toLocaleDateString("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 border-2 border-[#FFD700]/20 rounded-full"></div>
            <div className="absolute inset-0 border-2 border-t-[#FFD700] rounded-full animate-spin"></div>
          </div>
          <p className="text-sm text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <ToastContainer />

      {/* Sophisticated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FFD700] opacity-[0.03] blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#FFD700] opacity-[0.02] blur-[100px] rounded-full"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,215,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,215,0,0.03)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,black,transparent)]"></div>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-8 py-10">
        {/* Header Section */}
        <header className={`mb-12 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/20 mb-4">
                <div className="w-1.5 h-1.5 rounded-full bg-[#FFD700] animate-pulse"></div>
                <span className="text-[10px] font-medium tracking-[0.15em] text-[#FFD700] uppercase">
                  {role} Portal
                </span>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-light mb-3 tracking-tight">
                {greeting}, <span className="font-semibold text-[#FFD700]">{username}</span>
              </h1>
              
              <p className="text-sm text-gray-500 font-light">
                {formattedDate}
              </p>
            </div>

            {/* Live Clock Card */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-2xl opacity-20 blur group-hover:opacity-30 transition duration-500"></div>
              <div className="relative flex items-center gap-4 px-6 py-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl backdrop-blur-xl">
                <div className="relative">
                  <Clock size={32} className="text-[#FFD700]" strokeWidth={1.5} />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#FFD700] rounded-full animate-pulse"></div>
                </div>
                <div>
                  <div className="text-3xl font-light text-white tabular-nums tracking-tight">
                    {formattedTime}
                  </div>
                  <div className="text-[9px] text-gray-600 uppercase tracking-[0.2em] mt-0.5">
                    Indian Standard Time
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {stats.map((stat, i) => (
            <div
              key={i}
              className={`group relative transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-br from-[#FFD700]/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-500"></div>
              <div className="relative h-full p-6 rounded-2xl bg-[#0a0a0a] border border-[#1a1a1a] hover:border-[#FFD700]/30 transition-all duration-300">
                <div className="flex items-start justify-between mb-6">
                  <div className="p-2.5 rounded-xl bg-[#FFD700]/5 text-[#FFD700] group-hover:bg-[#FFD700]/10 transition-colors">
                    {stat.icon}
                  </div>
                  {stat.trend === "up" && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                      <TrendingUp size={11} className="text-emerald-400" />
                      <span className="text-[10px] font-medium text-emerald-400">
                        {stat.change}
                      </span>
                    </div>
                  )}
                  {stat.trend === "neutral" && (
                    <span className="text-[10px] text-gray-500 px-2 py-1 rounded-md bg-gray-500/5">
                      {stat.change}
                    </span>
                  )}
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-4xl font-light text-white tracking-tight">
                    {stat.value}
                  </h3>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    {stat.title}
                  </p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {stat.detail}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Role-Based Section */}
        <div className={`mb-12 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {role === "admin" && (
            <RoleSection
              icon={<User size={28} strokeWidth={1.5} />}
              title="Administrative Control Panel"
              desc="Comprehensive system management with advanced analytics, user administration, and security configuration. Maintain operational excellence across all departments."
              features={[
                { label: "User Management", desc: "Create, modify, and manage user accounts" },
                { label: "System Analytics", desc: "Real-time insights and reporting" },
                { label: "Security Settings", desc: "Advanced access controls" },
                { label: "Configuration", desc: "System-wide preferences" },
              ]}
            />
          )}

          {(role === "manager" || role === "hr") && (
            <RoleSection
              icon={<Briefcase size={28} strokeWidth={1.5} />}
              title="Team Management Hub"
              desc="Streamline team operations with approval workflows, performance tracking, and comprehensive reporting tools. Drive productivity and team success."
              features={[
                { label: "Leave Approvals", desc: "Review and process requests" },
                { label: "Performance Tracking", desc: "Monitor team metrics" },
                { label: "Team Reports", desc: "Generate insights" },
                { label: "Onboarding", desc: "New employee setup" },
              ]}
            />
          )}

          {role === "employee" && (
            <RoleSection
              icon={<User size={28} strokeWidth={1.5} />}
              title="Personal Workspace"
              desc="Manage your daily activities, track attendance, submit leave requests, and monitor your performance metrics. Stay organized and productive."
              features={[
                { label: "Attendance Log", desc: "Track your daily presence" },
                { label: "Leave Requests", desc: "Submit and monitor requests" },
                { label: "Project Updates", desc: "Log progress and tasks" },
                { label: "Timesheets", desc: "Record work hours" },
              ]}
            />
          )}
        </div>

        {/* Activity Summary */}
        <div className={`grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12 transition-all duration-700 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <ActivityCard
            title="This Week"
            value="5/5"
            subtitle="Days attended"
            icon={<CheckCircle2 size={18} />}
            iconColor="text-emerald-400"
            bgColor="bg-emerald-500/5"
          />
          <ActivityCard
            title="Today"
            value="8.5h"
            subtitle="Working hours"
            icon={<Clock size={18} />}
            iconColor="text-[#FFD700]"
            bgColor="bg-[#FFD700]/5"
          />
          <ActivityCard
            title="Status"
            value="Active"
            subtitle="Current status"
            icon={<Activity size={18} />}
            iconColor="text-blue-400"
            bgColor="bg-blue-500/5"
          />
        </div>

        {/* Footer */}
        <footer className="pt-8 border-t border-[#1a1a1a]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600">
            <p>
              Last synchronized: {time.toLocaleString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </p>
            <p className="text-gray-700">© 2025 Enterprise Management System</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

function RoleSection({ icon, title, desc, features }) {
  return (
    <div className="group relative">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FFD700]/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-700"></div>
      <div className="relative p-8 rounded-2xl bg-[#0a0a0a] border border-[#1a1a1a] hover:border-[#FFD700]/20 transition-all duration-500">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-shrink-0">
            <div className="p-4 rounded-2xl bg-[#FFD700]/5 text-[#FFD700] border border-[#FFD700]/10 group-hover:bg-[#FFD700]/10 transition-colors">
              {icon}
            </div>
          </div>
          
          <div className="flex-1 space-y-6">
            <div>
              <h2 className="text-2xl font-light mb-3 text-white">{title}</h2>
              <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="group/item flex items-start gap-3 p-4 rounded-xl bg-[#0f0f0f] border border-[#1a1a1a] hover:border-[#FFD700]/20 transition-all duration-300"
                >
                  <ArrowUpRight size={14} className="text-[#FFD700] mt-0.5 flex-shrink-0 group-hover/item:translate-x-0.5 group-hover/item:-translate-y-0.5 transition-transform" strokeWidth={2} />
                  <div>
                    <p className="text-sm font-medium text-white mb-1">
                      {feature.label}
                    </p>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityCard({ title, value, subtitle, icon, iconColor, bgColor }) {
  return (
    <div className="group relative">
      <div className="absolute -inset-0.5 bg-gradient-to-br from-[#FFD700]/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-500"></div>
      <div className="relative p-6 rounded-2xl bg-[#0a0a0a] border border-[#1a1a1a] hover:border-[#FFD700]/20 transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
          <span className="text-[10px] font-medium text-gray-500 uppercase tracking-[0.15em]">
            {title}
          </span>
          <div className={`p-2 rounded-lg ${bgColor} ${iconColor}`}>
            {icon}
          </div>
        </div>
        
        <div className="space-y-1">
          <p className="text-3xl font-light text-white tracking-tight">{value}</p>
          <p className="text-xs text-gray-600">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}