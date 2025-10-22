import React, { useState } from "react";
import {
  FileText,
  Download,
  Send,
  Upload,
  Eye,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function Payslips() {
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;
  const role = user?.role || "employee";

  // 📦 Dummy payslip data (replace with API later)
  const [payslips, setPayslips] = useState([
    {
      id: 1,
      month: "September 2025",
      fileName: "Payslip_Sep2025.pdf",
      url: "https://example.com/payslip_sep2025.pdf",
      uploadedAt: "2025-09-30",
    },
    {
      id: 2,
      month: "August 2025",
      fileName: "Payslip_Aug2025.pdf",
      url: "https://example.com/payslip_aug2025.pdf",
      uploadedAt: "2025-08-31",
    },
  ]);

  const [newPayslip, setNewPayslip] = useState(null);
  const [sending, setSending] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) setNewPayslip(file);
  };

  const handleSendToAll = () => {
    if (!newPayslip) {
      alert("Please upload a payslip PDF first.");
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      alert("Payslip sent to all employees successfully!");
      setNewPayslip(null);
    }, 1500);
  };

  return (
    <div className="flex flex-col flex-1 overflow-y-auto bg-[#0f0f0f] text-white p-6 md:p-8">
      {/* --- Header --- */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-[#FFD700]">
          <FileText size={24} /> Payslips
        </h1>
        <p className="text-sm text-gray-400">
          Logged in as{" "}
          <span className="capitalize text-[#FFD700]">{role}</span>
        </p>
      </div>

      {/* --- Manager/Admin Upload Section --- */}
      {(role === "manager" || role === "admin") && (
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-[#FFD700] mb-4 flex items-center gap-2">
            <Upload size={18} /> Upload & Send Payslips
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileUpload}
              className="w-full sm:w-auto text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#FFD700]/20 file:text-[#FFD700] hover:file:bg-[#FFD700]/30"
            />
            {newPayslip && (
              <p className="text-xs text-gray-400 truncate">
                Selected: {newPayslip.name}
              </p>
            )}

            <button
              onClick={handleSendToAll}
              disabled={sending}
              className="flex items-center gap-2 bg-gradient-to-r from-[#FFD700] to-[#ffffff] text-black font-semibold px-6 py-2 rounded-full hover:scale-105 transition disabled:opacity-50"
            >
              {sending ? (
                <>
                  <CheckCircle size={16} className="animate-pulse" /> Sending...
                </>
              ) : (
                <>
                  <Send size={16} /> Send to All
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* --- Payslips List --- */}
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
        <h2 className="text-lg font-semibold text-[#FFD700] mb-6 flex items-center gap-2">
          <Eye size={18} /> {role === "employee" ? "My Payslips" : "All Payslips"}
        </h2>

        {payslips.length === 0 ? (
          <p className="text-gray-400 text-center py-10">
            No payslips available yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#222] text-[#FFD700]">
                <tr>
                  <th className="p-3 text-left">Month</th>
                  <th className="p-3 text-left">File Name</th>
                  <th className="p-3 text-left">Uploaded On</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {payslips.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-[#2a2a2a] hover:bg-[#2a2a2a]/40 transition"
                  >
                    <td className="p-3">{p.month}</td>
                    <td className="p-3">{p.fileName}</td>
                    <td className="p-3">
                      {new Date(p.uploadedAt).toLocaleDateString("en-GB")}
                    </td>
                    <td className="p-3 text-center flex justify-center gap-3">
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#FFD700] hover:text-white transition"
                      >
                        <Eye size={18} />
                      </a>
                      <a
                        href={p.url}
                        download
                        className="text-[#18a04a] hover:text-white transition"
                      >
                        <Download size={18} />
                      </a>
                      {(role === "manager" || role === "admin") && (
                        <button
                          onClick={() => alert(`Payslip ${p.id} revoked.`)}
                          className="text-[#ff4b4b] hover:text-white transition"
                        >
                          <XCircle size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- Footer --- */}
      <p className="text-xs text-gray-500 mt-6">
        Note: Payslips are confidential documents generated monthly. Only visible
        after HR/Manager distribution.
      </p>
    </div>
  );
}
