import React, { useEffect, useState } from "react";
import { CalendarDays, PlusCircle, Trash2, X } from "lucide-react";
import {
  useGetHolidaysQuery,
  useCreateHolidayMutation,
  useDeleteHolidayMutation,
} from "../../features/holidays/holidayApiSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector, useDispatch } from "react-redux";
import { setHolidaysData } from "../../features/holidays/holidaySlice";

export default function Holidays() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const dispatch = useDispatch();

  const persistedHolidays = useSelector((state) => state.holidays);
  const lastFetched = useSelector((state) => state.holidays.lastFetched);

  // const skipFetch = selectedYear === currentYear && persistedHolidays;
  const skipFetch =
  !(
    selectedYear !== currentYear ||
    !persistedHolidays?.data ||
    persistedHolidays?.data?.length === 0
  )
    ? false
    : selectedYear === currentYear && persistedHolidays?.data?.length > 0;

  // console.log(persistedHolidays)

  const {
    data: holidaysResponse,
    isLoading,
    isSuccess,
    isError,
  } = useGetHolidaysQuery(selectedYear, {
    skip: skipFetch,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  useEffect(() => {
    if (selectedYear === currentYear && isSuccess && holidaysResponse?.data) {
      dispatch(setHolidaysData(holidaysResponse.data));
    }
  }, [selectedYear, currentYear, isSuccess, holidaysResponse, dispatch]);

  // Directly depend on selectedYear → refetches automatically when it changes
  // const { data, isLoading, isError } = useGetHolidaysQuery(selectedYear);

  const [createHoliday, { isLoading: creating }] = useCreateHolidayMutation();
  const [deleteHoliday, { isLoading: deleting }] = useDeleteHolidayMutation();
  const { user, currentMode } = useSelector((state) => state.auth);
  const role = user?.role?.toLowerCase() || "null";
  const isEmployeeMode = currentMode !== "employee";

  // console.log(isEmployeeMode)

  const [showModal, setShowModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    date: "",
    type: "public",
    year: currentYear,
  });

  // const holidays = data?.data || [];

  // const fetchHolidays =
  //   selectedYear === currentYear && persistedHolidays
  //     ? persistedHolidays
  //     : holidaysResponse?.data || [];

  // const holidays = fetchHolidays?.data

    // console.log(holidays)

    let holidays = [];

  if (selectedYear === currentYear && persistedHolidays?.data?.length) {
    // Use persisted Redux holidays if available
    holidays = persistedHolidays.data;
  } else if (holidaysResponse?.data?.length) {
    // Use freshly fetched data
    holidays = holidaysResponse.data;
  } else {
    holidays = []; // Fallback (no holidays)
  }

  const isEmpty = !holidays || holidays.length === 0;

  // Handle Create Holiday
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const { name, date, type, year } = form;
      const body = { name, date, type };
      const res = await createHoliday({ body, year }).unwrap();
      toast.success(res?.message || "Holiday added successfully!");
      setShowModal(false);
      setForm({
        name: "",
        date: "",
        type: "public",
        year: currentYear,
      });
    } catch (err) {
      toast.error(err?.data?.message || "Failed to add holiday");
    }
  };

  const confirmDelete = (holiday) => {
    setDeleteTarget(holiday);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await deleteHoliday(deleteTarget._id).unwrap();
      toast.success(res?.message || `${deleteTarget.name} deleted successfully!`);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete holiday");
    } finally {
      setShowDeleteModal(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="p-6 bg-black text-white min-h-screen">
      <ToastContainer position="top-right" />

      {/* ---------- HEADER ---------- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <CalendarDays className="text-[#FFD700]" /> Holiday Management
        </h1>

        <div className="flex flex-wrap items-center gap-3">
          {/* Year Dropdown → Automatically triggers query */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="bg-[#1a1a1a] border border-[#333] rounded-md px-3 py-2 text-white focus:outline-none focus:border-[#FFD700]"
          >
            {Array.from({ length: 10 }, (_, i) => {
              const year = currentYear - 3 + i;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>

          {(isEmployeeMode) && (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-[#FFD700] text-black px-4 py-2 rounded-md hover:bg-[#e6c200] transition"
            >
              <PlusCircle size={18} /> Add Holiday
            </button>
          )}
        </div>
      </div>

      {/* ---------- HOLIDAY TABLE ---------- */}
      <div className="overflow-x-auto bg-[#111] rounded-lg border border-[#333]">
        {isLoading ? (
          <p className="p-4 text-gray-400">Loading holidays...</p>
        ) : isError ? (
          <p className="p-4 text-red-400">Failed to fetch holidays.</p>
        ) : isEmpty ? (
          <p className="p-4 text-gray-400">No holidays found for {selectedYear}.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-[#222] text-[#FFD700]">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Year</th>
                {(isEmployeeMode) && (
                  <th className="px-4 py-3 text-center">Action</th>
                )}
              </tr>
            </thead>
            <tbody>
              {holidays?.map((holiday) => {
                const dateObj = new Date(holiday.date);
                const holidayYear = dateObj.getFullYear();

                return (
                  <tr
                    key={holiday._id}
                    className="border-t border-[#333] hover:bg-[#1a1a1a] transition"
                  >
                    <td className="px-4 py-3">{holiday.name}</td>
                    <td className="px-4 py-3">
                      {dateObj.toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3 capitalize">{holiday.type}</td>
                    <td className="px-4 py-3">{holidayYear}</td>
                    {(isEmployeeMode) && (
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => confirmDelete(holiday)}
                          className="text-red-500 hover:text-red-400 transition"
                          disabled={deleting}
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#111] border border-[#333] rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-[#FFD700]">
                Add Holiday
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block mb-1 text-gray-300">Holiday Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  required
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded-md px-3 py-2 text-white focus:outline-none focus:border-[#FFD700]"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block mb-1 text-gray-300">Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm({ ...form, date: e.target.value })
                  }
                  required
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded-md px-3 py-2 text-white focus:outline-none focus:border-[#FFD700]"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block mb-1 text-gray-300">Type</label>
                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm({ ...form, type: e.target.value })
                  }
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded-md px-3 py-2 text-white focus:outline-none focus:border-[#FFD700]"
                >
                  <option value="public">Public</option>
                  <option value="optional">Optional</option>
                </select>
              </div>

              {/* Year */}
              <div>
                <label className="block mb-1 text-gray-300">Year</label>
                <select
                  value={form.year}
                  onChange={(e) =>
                    setForm({ ...form, year: Number(e.target.value) })
                  }
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded-md px-3 py-2 text-white focus:outline-none focus:border-[#FFD700]"
                >
                  {Array.from({ length: 6 }, (_, i) => {
                    const year = new Date().getFullYear() + i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
              </div>

              <button
                type="submit"
                disabled={creating}
                className="w-full bg-[#FFD700] text-black font-semibold py-2 rounded-md hover:bg-[#e6c200] transition"
              >
                {creating ? "Adding..." : "Add Holiday"}
              </button>
            </form>
          </div>
        </div>
      )}


      {/* Delete Confirmation Modal */}
{showDeleteModal && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
    <div className="bg-[#111] border border-[#333] rounded-lg p-6 w-full max-w-sm text-center">
      <h2 className="text-xl font-semibold text-[#FFD700] mb-3">
        Confirm Deletion
      </h2>
      <p className="text-gray-300 mb-6">
        Are you sure you want to delete{" "}
        <span className="text-[#FFD700] font-medium">
          {deleteTarget?.name}
        </span>{" "}
        from the holiday list?
      </p>

      <div className="flex justify-center gap-4">
        <button
          onClick={() => setShowDeleteModal(false)}
          className="px-5 py-2 rounded-md border border-[#FFD700]/50 text-gray-300 hover:bg-[#222] transition"
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="px-5 py-2 rounded-md bg-red-600 text-white font-semibold hover:bg-red-500 transition"
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
