// import { useUpdateAttendanceMutation } from "../../features/attendance/attendanceApiSlice";
// import { Form, Formik, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import { toast } from "react-toastify";
// import { Loader2, X } from "lucide-react";

// export default function UpdateAttendanceModal({ isOpen, onClose, record }) {
//   const [updateAttendance, { isLoading }] = useUpdateAttendanceMutation();

//   const updatableFields = [
//     "status",
//     "checkIn",
//     "checkOut",
//     "totalBreakDuration",
//     "breaks",
//     "isLate",
//     "isEarlyLeave",
//     "lateBy",
//     "earlyBy",
//     "workHours",
//     "productiveHours",
//     "overtime",
//     "remarks",
//   ];

//   const initialValues = {
//     status: record?.status || "",
//     "checkIn.time": record?.checkIn?.time
//       ? new Date(record.checkIn.time).toISOString().slice(0, 16)
//       : "",
//     "checkIn.coordinates":
//       record?.checkIn?.location?.coordinates?.join(",") || "",
//     "checkOut.time": record?.checkOut?.time
//       ? new Date(record.checkOut.time).toISOString().slice(0, 16)
//       : "",
//     "checkOut.coordinates":
//       record?.checkOut?.location?.coordinates?.join(",") || "",
//     totalBreakDuration: record?.totalBreakDuration || "",
//     breaks: record?.breaks || "",
//     isLate: record?.isLate || false,
//     isEarlyLeave: record?.isEarlyLeave || false,
//     lateBy: record?.lateBy || "",
//     earlyBy: record?.earlyBy || "",
//     workHours: record?.workHours || "",
//     productiveHours: record?.productiveHours || "",
//     overtime: record?.overtime || "",
//     remarks: record?.remarks || "",
//   };

//   const validationSchema = Yup.object({
//     remarks: Yup.string().required("Remarks are mandatory for any update"),
//   });

//         console.log(record, record?._id);

//   const handleSubmit = async (values, { setSubmitting }) => {
//     try {
//       const payload = {};
//       // --- Build nested structure correctly ---
//       if (values.status) payload.status = values.status;

//       if (values["checkIn.time"] || values["checkIn.coordinates"]) {
//         payload.checkIn = {};
//         if (values["checkIn.time"])
//           payload.checkIn.time = new Date(values["checkIn.time"]).toISOString();
//         if (values["checkIn.coordinates"]) {
//           const coords = values["checkIn.coordinates"]
//             .split(",")
//             .map((v) => parseFloat(v.trim()));
//           payload.checkIn.location = { type: "Point", coordinates: coords };
//         }
//       }

//       if (values["checkOut.time"] || values["checkOut.coordinates"]) {
//         payload.checkOut = {};
//         if (values["checkOut.time"])
//           payload.checkOut.time = new Date(
//             values["checkOut.time"]
//           ).toISOString();
//         if (values["checkOut.coordinates"]) {
//           const coords = values["checkOut.coordinates"]
//             .split(",")
//             .map((v) => parseFloat(v.trim()));
//           payload.checkOut.location = { type: "Point", coordinates: coords };
//         }
//       }

//       // Flat fields
//       [
//         "totalBreakDuration",
//         "breaks",
//         "isLate",
//         "isEarlyLeave",
//         "lateBy",
//         "earlyBy",
//         "workHours",
//         "productiveHours",
//         "overtime",
//       ].forEach((key) => {
//         if (values[key] !== "" && values[key] !== undefined)
//           payload[key] = values[key];
//       });

//       payload.remarks = values.remarks;

//       await updateAttendance({
//         id: record?._id,
//         body: payload,
//       }).unwrap();
//       toast.success("Attendance updated successfully");
//       onClose();
//     } catch (err) {
//       toast.error(err?.data?.message || "Failed to update attendance");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (!isOpen) return null;
//   return (
//     <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
//       <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl w-full max-w-lg shadow-xl p-6 overflow-y-auto max-h-[90vh]">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-lg font-bold text-[#FFD700]">
//             Update Attendance
//           </h2>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-[#FFD700] transition-colors"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         <Formik
//           initialValues={initialValues}
//           validationSchema={validationSchema}
//           onSubmit={handleSubmit}
//           enableReinitialize
//         >
//           {({ isSubmitting }) => (
//             <Form className="space-y-3">
//               {/* Status */}
//               <div className="flex flex-col">
//                 <label className="text-xs text-gray-400 mb-1">Status</label>
//                 <Field
//                   as="select"
//                   name="status"
//                   className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]"
//                 >
//                   <option value="">Select Status</option>
//                   <option value="present">Present</option>
//                   <option value="absent">Absent</option>
//                   <option value="halfday">Half Day</option>
//                 </Field>
//               </div>

//               {/* Check-in fields */}
//               <div className="flex flex-col gap-1">
//                 <label className="text-xs text-gray-400 mb-1">
//                   Check-In Time
//                 </label>
//                 <Field
//                   type="datetime-local"
//                   name="checkIn.time"
//                   className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]"
//                 />
//               </div>
//               <div className="flex flex-col gap-1">
//                 <label className="text-xs text-gray-400 mb-1">
//                   Check-In Coordinates
//                 </label>
//                 <Field
//                   type="text"
//                   name="checkIn.coordinates"
//                   placeholder="78.3669,17.4363"
//                   className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]"
//                 />
//               </div>

//               {/* Check-out fields */}
//               <div className="flex flex-col gap-1">
//                 <label className="text-xs text-gray-400 mb-1">
//                   Check-Out Time
//                 </label>
//                 <Field
//                   type="datetime-local"
//                   name="checkOut.time"
//                   className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]"
//                 />
//               </div>
//               <div className="flex flex-col gap-1">
//                 <label className="text-xs text-gray-400 mb-1">
//                   Check-Out Coordinates
//                 </label>
//                 <Field
//                   type="text"
//                   name="checkOut.coordinates"
//                   placeholder="78.3669,17.4363"
//                   className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]"
//                 />
//               </div>

//               {/* Other fields */}
//               {[
//                 "totalBreakDuration",
//                 "breaks",
//                 "isLate",
//                 "isEarlyLeave",
//                 "lateBy",
//                 "earlyBy",
//                 "workHours",
//                 "productiveHours",
//                 "overtime",
//               ].map((field) => (
//                 <div key={field} className="flex flex-col">
//                   <label className="text-xs text-gray-400 mb-1 capitalize">
//                     {field.replace(/([A-Z])/g, " $1")}
//                   </label>
//                   {["isLate", "isEarlyLeave"].includes(field) ? (
//                     <Field
//                       type="checkbox"
//                       name={field}
//                       className="accent-[#FFD700] h-4 w-4"
//                     />
//                   ) : (
//                     <Field
//                       type="text"
//                       name={field}
//                       className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]"
//                     />
//                   )}
//                 </div>
//               ))}

//               {/* Remarks */}
//               <div className="flex flex-col">
//                 <label className="text-xs text-gray-400 mb-1">Remarks</label>
//                 <Field
//                   as="textarea"
//                   name="remarks"
//                   placeholder="Enter remarks..."
//                   className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white resize-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]"
//                 />
//                 <ErrorMessage
//                   name="remarks"
//                   component="div"
//                   className="text-xs text-red-400 mt-1"
//                 />
//               </div>

//               <button
//                 type="submit"
//                 disabled={isSubmitting || isLoading}
//                 className="w-full flex justify-center items-center gap-2 mt-4 bg-[#FFD700] text-black font-semibold py-2.5 rounded-lg hover:bg-[#e0c300] transition-all"
//               >
//                 {isSubmitting || isLoading ? (
//                   <>
//                     <Loader2 className="animate-spin" size={16} /> Updating...
//                   </>
//                 ) : (
//                   "Update Attendance"
//                 )}
//               </button>
//             </Form>
//           )}
//         </Formik>
//       </div>
//     </div>
//   );
// }


import { useUpdateAttendanceMutation } from "../../features/attendance/attendanceApiSlice";
import { Form, Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { Loader2, X } from "lucide-react";

export default function UpdateAttendanceModal({ isOpen, onClose, record }) {
  const [updateAttendance, { isLoading }] = useUpdateAttendanceMutation();

  // Helper to extract time from UTC string and convert to local time
  const extractTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Helper to extract date from the attendance date field
  const extractDate = (isoString) => {
    if (!isoString) return "";
    // Extract just the date part (YYYY-MM-DD)
    return isoString.split('T')[0];
  };

  // Use the attendance date field for the date, not the checkIn/checkOut time
  const attendanceDate = extractDate(record?.date);
  const checkInTime = extractTime(record?.checkIn?.time);
  const checkOutTime = extractTime(record?.checkOut?.time);

  const initialValues = {
    status: record?.status || "",
    checkInDate: attendanceDate,
    checkInTime: checkInTime,
    checkInCoordinates:
      record?.checkIn?.location?.coordinates?.join(",") || "",
    checkOutDate: attendanceDate,
    checkOutTime: checkOutTime,
    checkOutCoordinates:
      record?.checkOut?.location?.coordinates?.join(",") || "",
    totalBreakDuration: record?.totalBreakDuration || "",
    breaks: record?.breaks || "",
    isLate: record?.isLate || false,
    isEarlyLeave: record?.isEarlyLeave || false,
    lateBy: record?.lateBy || "",
    earlyBy: record?.earlyBy || "",
    workHours: record?.workHours || "",
    productiveHours: record?.productiveHours || "",
    overtime: record?.overtime || "",
    remarks: record?.remarks || "",
  };

  const validationSchema = Yup.object({
    remarks: Yup.string().required("Remarks are mandatory for any update"),
  });

  // console.log(record, record?._id);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const payload = {};
      
      if (values.status) payload.status = values.status;

      // Build checkIn with separate date and time
      if (values.checkInDate || values.checkInTime || values.checkInCoordinates) {
        payload.checkIn = {};
        if (values.checkInDate && values.checkInTime) {
          // Parse date and time components
          const [year, month, day] = values.checkInDate.split("-").map(Number);
          const [hours, minutes] = values.checkInTime.split(":").map(Number);
          
          // Create date in local timezone and convert to UTC
          const localDateTime = new Date(year, month - 1, day, hours, minutes, 0);
          payload.checkIn.time = localDateTime.toISOString();
          
          // console.log("Local time selected:", values.checkInDate, values.checkInTime);
          // console.log("Converted to UTC:", payload.checkIn.time);
        }
        if (values.checkInCoordinates) {
          const coords = values.checkInCoordinates
            .split(",")
            .map((v) => parseFloat(v.trim()));
          payload.checkIn.location = { type: "Point", coordinates: coords };
        }
      }

      // Build checkOut with separate date and time
      if (values.checkOutDate || values.checkOutTime || values.checkOutCoordinates) {
        payload.checkOut = {};
        if (values.checkOutDate && values.checkOutTime) {
          // Parse date and time components
          const [year, month, day] = values.checkOutDate.split("-").map(Number);
          const [hours, minutes] = values.checkOutTime.split(":").map(Number);
          
          // Create date in local timezone and convert to UTC
          const localDateTime = new Date(year, month - 1, day, hours, minutes, 0);
          payload.checkOut.time = localDateTime.toISOString();
        }
        if (values.checkOutCoordinates) {
          const coords = values.checkOutCoordinates
            .split(",")
            .map((v) => parseFloat(v.trim()));
          payload.checkOut.location = { type: "Point", coordinates: coords };
        }
      }

      // Flat fields
      [
        "totalBreakDuration",
        "breaks",
        "isLate",
        "isEarlyLeave",
        "lateBy",
        "earlyBy",
        "workHours",
        "productiveHours",
        "overtime",
      ].forEach((key) => {
        if (values[key] !== "" && values[key] !== undefined)
          payload[key] = values[key];
      });

      payload.remarks = values.remarks;

      // console.log("Payload being sent:", payload);

      await updateAttendance({
        id: record?._id,
        body: payload,
      }).unwrap();
      toast.success("Attendance updated successfully");
      onClose();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update attendance");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl w-full max-w-lg shadow-xl p-6 overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-[#FFD700]">
            Update Attendance
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-[#FFD700] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, values }) => {
            // console.log("Current form values:", values);
            return (
            <Form className="space-y-3">
              {/* Status */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-400 mb-1">Status</label>
                <Field
                  as="select"
                  name="status"
                  className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]"
                >
                  <option value="">Select Status</option>
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="halfday">Half Day</option>
                </Field>
              </div>

              {/* Check-in fields */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-400 mb-1">
                  Check-In Date
                </label>
                <Field
                  type="date"
                  name="checkInDate"
                  className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-400 mb-1">
                  Check-In Time
                </label>
                <Field
                  type="time"
                  name="checkInTime"
                  className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-400 mb-1">
                  Check-In Coordinates
                </label>
                <Field
                  type="text"
                  name="checkInCoordinates"
                  placeholder="78.3669,17.4363"
                  className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]"
                />
              </div>

              {/* Check-out fields */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-400 mb-1">
                  Check-Out Date
                </label>
                <Field
                  type="date"
                  name="checkOutDate"
                  className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-400 mb-1">
                  Check-Out Time
                </label>
                <Field
                  type="time"
                  name="checkOutTime"
                  className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-400 mb-1">
                  Check-Out Coordinates
                </label>
                <Field
                  type="text"
                  name="checkOutCoordinates"
                  placeholder="78.3669,17.4363"
                  className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]"
                />
              </div>

              {/* Other fields */}
              {[
                "totalBreakDuration",
                "breaks",
                "isLate",
                "isEarlyLeave",
                "lateBy",
                "earlyBy",
                "workHours",
                "productiveHours",
                "overtime",
              ].map((field) => (
                <div key={field} className="flex flex-col">
                  <label className="text-xs text-gray-400 mb-1 capitalize">
                    {field.replace(/([A-Z])/g, " $1")}
                  </label>
                  {["isLate", "isEarlyLeave"].includes(field) ? (
                    <Field
                      type="checkbox"
                      name={field}
                      className="accent-[#FFD700] h-4 w-4"
                    />
                  ) : (
                    <Field
                      type="text"
                      name={field}
                      className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]"
                    />
                  )}
                </div>
              ))}

              {/* Remarks */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-400 mb-1">Remarks</label>
                <Field
                  as="textarea"
                  name="remarks"
                  placeholder="Enter remarks..."
                  className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white resize-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]"
                />
                <ErrorMessage
                  name="remarks"
                  component="div"
                  className="text-xs text-red-400 mt-1"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="w-full flex justify-center items-center gap-2 mt-4 bg-[#FFD700] text-black font-semibold py-2.5 rounded-lg hover:bg-[#e0c300] transition-all"
              >
                {isSubmitting || isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={16} /> Updating...
                  </>
                ) : (
                  "Update Attendance"
                )}
              </button>
            </Form>
          );
          }}
        </Formik>
      </div>
    </div>
  );
}