import React, { useState } from "react";
import {
  Bell,
  CheckCircle,
  XCircle,
  Clock,
  FileWarning,
  RefreshCw,
  MessageSquare,
  Eye,
} from "lucide-react";

export default function Notifications() {
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;
  const role = user?.role || "employee";

  if (role === "employee") {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        You don’t have access to this section.
      </div>
    );
  }

  // State management
  const [activeTab, setActiveTab] = useState("leaves");

  const notifications = {
    leaves: [
      {
        id: 1,
        name: "Swetha Bura",
        type: "Casual Leave",
        message: "Requested leave for 2 days (Oct 15–16)",
        date: "2025-10-12 09:15 AM",
      },
      {
        id: 2,
        name: "Abhishek Rao",
        type: "Medical Leave",
        message: "Applied medical leave for 3 days (Oct 18–20)",
        date: "2025-10-13 10:42 AM",
      },
    ],
    reopen: [
      {
        id: 3,
        name: "Kiran Kumar",
        type: "PF & Insurance Reopen",
        message: "Requested to reopen PF details for correction.",
        date: "2025-10-12 06:22 PM",
      },
    ],
    complaints: [
      {
        id: 4,
        name: "Meghana R",
        type: "Workplace Complaint",
        message: "Reported a complaint regarding project delay and load.",
        date: "2025-10-11 05:50 PM",
      },
    ],
  };

  const handleAction = (category, id, action) => {
    alert(`Notification ${id} (${category}) marked as ${action}`);
    // You’ll later update backend here to change status
  };

  return (
    <div className="flex flex-col flex-1 overflow-y-auto bg-[#0f0f0f] text-white p-6 md:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-[#FFD700]">
          <Bell size={24} /> Notifications Center
        </h1>
        <p className="text-gray-400 text-sm">
          Manager view — categorized by type
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-[#222]">
        {["leaves", "reopen", "complaints"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`capitalize pb-2 px-4 font-medium transition ${
              activeTab === tab
                ? "border-b-2 border-[#FFD700] text-[#FFD700]"
                : "text-gray-400 hover:text-[#FFD700]/70"
            }`}
          >
            {tab === "leaves"
              ? "Leaves"
              : tab === "reopen"
              ? "Reopen Requests"
              : "Complaints"}
          </button>
        ))}
      </div>

      {/* Notification Cards */}
      <div className="space-y-4">
        {notifications[activeTab].length === 0 ? (
          <div className="text-gray-500 text-center py-10">
            No {activeTab} notifications available.
          </div>
        ) : (
          notifications[activeTab].map((item) => (
            <div
              key={item.id}
              className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#222]/60 transition"
            >
              <div className="flex items-start gap-3">
                {/* Icon based on tab */}
                <div className="mt-1 text-[#FFD700]">
                  {activeTab === "leaves" && <Clock size={20} />}
                  {activeTab === "reopen" && <RefreshCw size={20} />}
                  {activeTab === "complaints" && <MessageSquare size={20} />}
                </div>

                <div>
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-sm text-[#c1d42c]">{item.type}</p>
                  <p className="text-gray-300 text-sm mt-1">{item.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.date}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => handleAction(activeTab, item.id, "approved")}
                  className="flex items-center gap-1 bg-[#18a04a]/20 border border-[#18a04a]/40 text-[#18a04a] px-4 py-2 rounded-md hover:bg-[#18a04a]/30 transition"
                >
                  <CheckCircle size={16} /> Approve
                </button>
                <button
                  onClick={() => handleAction(activeTab, item.id, "rejected")}
                  className="flex items-center gap-1 bg-[#a01818]/20 border border-[#a01818]/40 text-[#ff5c5c] px-4 py-2 rounded-md hover:bg-[#a01818]/30 transition"
                >
                  <XCircle size={16} /> Reject
                </button>
                <button
                  onClick={() => handleAction(activeTab, item.id, "viewed")}
                  className="flex items-center gap-1 border border-[#FFD700]/40 text-[#FFD700] px-4 py-2 rounded-md hover:bg-[#FFD700]/20 transition"
                >
                  <Eye size={16} /> View
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
