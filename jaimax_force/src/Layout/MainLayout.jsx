import React, { useEffect, useState } from "react";
import Sidebar from "./sidebar";
import Navbar from "./Navbar";
import { useGetProfileQuery } from "../features/profile/profileApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { setProfileData } from "../features/profile/profileSlice";

export default function MainLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

// const dispatch = useDispatch();
//   const profile = useSelector((state) => state.profile.data);
//   const lastFetched = useSelector((state) => state.profile.lastFetched);

//   // Refresh only if older than 1 day (adjust as you like)
//   const shouldRefetch =
//     !lastFetched || Date.now() - lastFetched > 24 * 60 * 60 * 1000;

//   const { data, isSuccess } = useGetProfileQuery(undefined, {
//     skip: !!profile && !shouldRefetch,
//     refetchOnMountOrArgChange: false,
//   });

//   useEffect(() => {
//     if (isSuccess && data?.data) {
//       dispatch(setProfileData(data.data));
//     }
//   }, [isSuccess, data, dispatch]);

  return (
    <div className="flex h-screen bg-[#0f0f0f] text-white overflow-hidden">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex flex-col flex-1 min-w-0">
        <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        <main className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#2a2a2a] scrollbar-track-transparent">
          {children}
        </main>
      </div>
    </div>
  );
}
