import React, { useState } from "react";
import { MessageSquare, Send, Upload, CheckCircle } from "lucide-react";

export default function Feedback() {
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;
  const role = user?.role || "employee";

  if (role !== "employee") {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        This section is for employees only.
      </div>
    );
  }

  const [feedback, setFeedback] = useState({
    type: "feedback",
    message: "",
    file: null,
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeedback((prev) => ({ ...prev, [name]: value }));
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    setFeedback((prev) => ({ ...prev, file }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!feedback.message.trim()) {
      alert("Please write your feedback or complaint.");
      return;
    }

    // TODO: connect to backend POST /feedback
    console.log("Feedback submitted:", feedback);

    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFeedback({ type: "feedback", message: "", file: null });
  };

  return (
    <div className="flex flex-col flex-1 overflow-y-auto bg-[#0f0f0f] text-white p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-[#FFD700]">
          <MessageSquare size={24} /> Feedback / Complaints
        </h1>
        <p className="text-sm text-gray-400">
          Logged in as{" "}
          <span className="text-[#FFD700] capitalize">{role}</span>
        </p>
      </div>

      {/* Form Section */}
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 shadow-md max-w-2xl">
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type Selection */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Select Type
              </label>
              <select
                name="type"
                value={feedback.type}
                onChange={handleChange}
                className="w-full p-2 rounded-md bg-[#111] border border-[#FFD700]/40 text-white focus:border-[#FFD700] outline-none"
              >
                <option value="feedback">Feedback</option>
                <option value="complaint">Complaint</option>
                <option value="suggestion">Suggestion</option>
              </select>
            </div>

            {/* Message Box */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Your Message
              </label>
              <textarea
                name="message"
                value={feedback.message}
                onChange={handleChange}
                rows={5}
                placeholder="Describe your issue or suggestion..."
                className="w-full p-3 rounded-md bg-[#111] border border-[#FFD700]/40 text-white focus:border-[#FFD700] outline-none resize-none"
              ></textarea>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Attach Screenshot (optional)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  onChange={handleFile}
                  className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#FFD700]/20 file:text-[#FFD700] hover:file:bg-[#FFD700]/30"
                />
                {feedback.file && (
                  <p className="text-xs text-gray-400 truncate">
                    {feedback.file.name}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-[#FFD700] to-[#ffffff] text-black rounded-full font-semibold hover:scale-105 transition flex items-center gap-2"
              >
                <Send size={16} /> Submit
              </button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CheckCircle size={40} className="text-[#18a04a] mb-4" />
            <h3 className="text-xl font-semibold text-[#FFD700] mb-2">
              Feedback Submitted!
            </h3>
            <p className="text-gray-400 text-sm">
              Your message has been sent to your manager. You’ll be notified
              once it’s reviewed.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
