import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useGetProfileQuery } from "../features/profile/profileApiSlice";
import { useDispatch } from "react-redux";
import { setProfileData } from "../features/profile/profileSlice";

export default function MainLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const {data, isSuccess} =  useGetProfileQuery(undefined, {
    refetchOnMountOrArgChange: false,
  });

  const dispatch = useDispatch();

  // console.log(data);

  useEffect(()=>{
   if(isSuccess && data?.data){
    dispatch(setProfileData(data.data));
   } 
  },[isSuccess, data, dispatch]);

  return (
    <div className="flex h-screen bg-[#0f0f0f] text-white overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="flex flex-col flex-1 min-w-0">
        <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        <main className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-[#2a2a2a] scrollbar-track-transparent">
          {children}
        </main>
      </div>
    </div>
  );
}
