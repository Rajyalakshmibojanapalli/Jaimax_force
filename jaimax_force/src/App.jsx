import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import LandingPage from "./pages/landingPage/LandingPage";
import LoginPage from "./pages/authentication/Login";
import OnBoarding from "./pages/onboarding/onBoarding";
import SubmitFiles from "./pages/onboarding/submitFiles";
import ManagerOnboard from "./pages/manager/ManagerOnboard";
import OnboardingSuccess from "./pages/onboarding/onboardingSucess";

import PrivateRoute from "./router/PrivateRouter";
import PublicRoute from "./router/PublicRoute";
import Dashboard from "./pages/dashboard/dashboard";
import MainLayout from "./Layout/MainLayout";
import Attendance from "./pages/attendance/attendance";
import OnboardingStatus from "./pages/onboardingStatus/onboardingStatus";
import OnboardMembers from "./pages/manager/onBoardmembers";
import Profile from "./pages/profile/profile";
import Leaves from "./pages/leaves/leaves";
import AppliedLeaves from "./pages/manager/AppliedLeaves";
import TotalTeam from "./pages/manager/TotalTeam";
import Holidays from "./pages/Holidays/holidays";
import PfAndInsurance from "./pages/hr/PfAndInsurance";
import Notifications from "./pages/manager/Notifications";
import Feedback from "./pages/feedback/Feedback";
import Payslips from "./pages/hr/paySlips";
import { useSelector } from "react-redux";
import ResetPassword from "./pages/authentication/resetPassword";
import AllEmployeeAttendance from "./pages/attendance/AllEmployeeAttendance";
import MonthlyStatsOfTeam from "./pages/attendance/MonthlyStatsOfTeam";
import TeamLeaves from "./pages/leaves/TeamLeaves";

export default function App() {
  // const userData = localStorage.getItem("user");
  // const user = userData ? JSON.parse(userData) : null;
  // const role = user?.role || null;
  const {user} = useSelector((state)=> state.auth);
  const role = user?.role || null;

  return (
    <>
      <ToastContainer />
      <Routes>
        {/* ---------- ONBOARDING ROUTES (always public) ---------- */}
        <Route path="/onboarding/:token" element={<OnBoarding />} />
        <Route path="/onboarding/form/:selected" element={<SubmitFiles />} />
        <Route path="/onboarding-success" element={<OnboardingSuccess />} />
        <Route path="/reset-password/:token" element={<ResetPassword />}/>

        {/* ---------- PUBLIC ROUTES ---------- */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<LandingPage />} />
        </Route>

        {/* ---------- PRIVATE ROUTES ---------- */}
        <Route element={<PrivateRoute />}>
          {(role === "admin" || role === "manager" || role === "hr") && (
            <>
              <Route path="/dashboard" element={ <MainLayout><Dashboard /></MainLayout>} />
              <Route path="/manager-onboard" element={<MainLayout><ManagerOnboard /></MainLayout>} />
              <Route path="/attendance" element={<MainLayout><Attendance /></MainLayout>}/>
              <Route path="/onboarding-status" element={<MainLayout><OnboardingStatus /></MainLayout>}/>
              <Route path="/onboard-members" element={<MainLayout><OnboardMembers /></MainLayout>}/>
              <Route path="/profile" element={<MainLayout><Profile /></MainLayout>}/>
              <Route path="/leaves" element={<MainLayout><Leaves /></MainLayout>}/>
              <Route path="/applied-leaves" element={<MainLayout><AppliedLeaves /></MainLayout>}/>
              <Route path="/total-team" element={<MainLayout><TotalTeam /></MainLayout>}/>
              <Route path="/holidays" element={<MainLayout><Holidays /></MainLayout>}/>
              <Route path="/pf-insurance" element={<MainLayout><PfAndInsurance /></MainLayout>}/>
              <Route path="/notifications" element={<MainLayout><Notifications /></MainLayout>}/>
              <Route path="/payslips" element={<MainLayout><Payslips /></MainLayout>}/>
              <Route path="/all-attendance" element={<MainLayout><AllEmployeeAttendance /></MainLayout>}/>
              <Route path="/all-stats" element={<MainLayout><MonthlyStatsOfTeam /></MainLayout>}/>
              <Route path="/team-leaves" element={<MainLayout><TeamLeaves /></MainLayout>}/>

            </>
          )}
          {/* add employee dashboard here later */}
          {role === "employee" && (
            <>
            <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
             <Route path="/attendance" element={<MainLayout><Attendance /></MainLayout>}/>
             <Route path="/onboarding-status" element={<MainLayout><OnboardingStatus /></MainLayout>}/>
             <Route path="/profile" element={<MainLayout><Profile /></MainLayout>}/>
             <Route path="/leaves" element={<MainLayout><Leaves /></MainLayout>}/>
             <Route path="/holidays" element={<MainLayout><Holidays /></MainLayout>}/>
             <Route path="/pf-insurance" element={<MainLayout><PfAndInsurance /></MainLayout>}/>
             <Route path="/feedback" element={<MainLayout><Feedback /></MainLayout>}/>
             <Route path="/payslips" element={<MainLayout><Payslips /></MainLayout>}/>
             </>
          )}
        </Route>

        {/* ---------- FALLBACK ---------- */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
