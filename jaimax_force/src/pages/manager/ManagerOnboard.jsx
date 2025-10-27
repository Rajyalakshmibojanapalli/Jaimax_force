import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";
import { useCreateUserMutation } from "../../features/onboarding/onboardingApiSlice";

export default function ManagerOnboard() {
  const [step, setStep] = useState(1);
  const [createUser, { isLoading }] = useCreateUserMutation();

  // Utility: Capitalize each word (for payload)
  const capitalizeWords = (str) =>
    str
      ? str
          .toLowerCase()
          .replace(/\b\w/g, (char) => char.toUpperCase())
          .trim()
      : "";

  // Step-wise validation schemas
  const stepSchemas = [
    // Step 1
    Yup.object({
      firstName: Yup.string()
        .matches(/^[A-Za-z ]+$/, "Only alphabets allowed")
        .required("First Name is required"),
      lastName: Yup.string()
        .matches(/^[A-Za-z ]+$/, "Only alphabets allowed")
        .required("Last Name is required"),
      gender: Yup.string().required("Select gender"),
      dob: Yup.date()
        .required("Date of Birth required")
        .test("age", "Must be at least 18 years old", (value) => {
          if (!value) return false;
          const today = new Date();
          const dob = new Date(value);
          const age =
            today.getFullYear() -
            dob.getFullYear() -
            (today <
            new Date(today.getFullYear(), dob.getMonth(), dob.getDate())
              ? 1
              : 0);
          return age >= 18;
        }),
      phone: Yup.string()
        .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
        .required("Phone number is required"),
    }),

    // Step 2
    Yup.object({
      department: Yup.string()
        .matches(/^[A-Za-z ]+$/, "Only alphabets allowed")
        .required("Department is required"),
      designation: Yup.string()
        .matches(/^[A-Za-z ]+$/, "Only alphabets allowed")
        .required("Designation required"),
      joinDate: Yup.date().required("Joining date is required"),
      employmentType: Yup.string().required("Select employment type"),
      workLocation: Yup.string()
        .matches(/^[A-Za-z ]+$/, "Only alphabets allowed")
        .required("Work location required"),
      workShift: Yup.string().required("Work shift required"),
    }),

    // Step 3
    Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),
      role: Yup.string().required("Role is required"),
    }),

    // Step 4 (no validation)
    Yup.object(),
  ];

  // Handle Submit
 const handleSubmit = async (values, helpers) => {
  const { validateForm, setTouched, resetForm } = helpers;

  // run validation before changing step
  const errors = await validateForm();
  if (Object.keys(errors).length > 0) {
    // mark all fields of this step as touched so messages show
    setTouched(
      Object.keys(errors).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    );
    return; // stop here, don't advance
  }
    if (step < 4) {
      setStep((s) => s + 1);
      return;
    }

    const payload = {
      personalInfo: {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        dateOfBirth: values.dob,
        gender: capitalizeWords(values.gender),
      },
      companyInfo: {
        department: values.department,
        designation: values.designation,
        dateOfJoining: values.joinDate,
        employmentType: capitalizeWords(values.employmentType),
        workLocation: values.workLocation,
        workShift: capitalizeWords(values.workShift),
      },
      role: values.role.toLowerCase(), // keep lowercase
    };

    try {
      const res = await createUser(payload).unwrap();
      toast.success(res?.message || "User created successfully!");
      resetForm();
      setStep(1);
    } catch (err) {
      console.error("Create User Error:", err);
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

  // Required label helper
  const ReqLabel = ({ children }) => (
    <label className="block text-gray-300 font-semibold mb-2">
      {children}
      <span className="text-[#FFD700] ml-1">*</span>
    </label>
  );

  // 🎨 Styling
  const cardCls =
    "bg-[#0a0a0a]/80 border border-[#FFD700]/30 rounded-2xl shadow-[0_0_25px_rgba(255,215,0,0.1)] p-6 sm:p-8 w-full max-w-2xl mx-auto transition-all duration-500";
  const inputCls =
    "w-full px-4 py-2 rounded-md bg-[#111] text-white border border-[#FFD700]/40 focus:border-[#FFD700] focus:outline-none transition";
  const btnPrimary =
    "px-10 py-3 rounded-full bg-[#FFD700] text-black font-semibold hover:bg-[#f6ca00] transition-all";
  const btnSecondary =
    "px-6 py-2 border border-gray-600 rounded-full text-gray-300 hover:border-[#FFD700] transition-all";

  return (
    <div className="flex flex-col flex-1 w-full min-h-screen overflow-y-auto bg-black text-white px-4 sm:px-6 lg:px-8 py-6 font-sans">
      <ToastContainer position="top-right" autoClose={2000} theme="dark" />

      {/* Step Indicator */}
      <div className="flex justify-center items-center mb-10 w-full">
        <div className="flex items-center justify-center gap-1 sm:gap-2 md:gap-3 w-full max-w-[600px] px-2 sm:px-4">
          {["1", "2", "3", "4"].map((num, i) => (
            <div
              key={i}
              className={`flex items-center ${
                i === 3 ? "flex-none" : "flex-1"
              } justify-center`}
            >
              <div
                className={`flex items-center justify-center rounded-full border-2 
                ${
                  step === i + 1
                    ? "border-[#FFD700] bg-[#FFD700] text-black font-bold"
                    : step > i + 1
                    ? "border-[#FFD700] bg-[#FFD700]/40 text-white"
                    : "border-gray-600 text-gray-500"
                }
                w-6 h-6 text-[10px] sm:w-8 sm:h-8 sm:text-xs md:w-9 md:h-9 md:text-sm`}
              >
                {num}
              </div>

              {i !== 3 && (
                <div
                  className={`h-[2px] flex-1 mx-1 sm:mx-2 ${
                    step > i + 1 ? "bg-[#FFD700]" : "bg-gray-600"
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Formik */}
      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          gender: "",
          dob: "",
          phone: "",
          department: "",
          designation: "",
          joinDate: "",
          employmentType: "",
          workLocation: "",
          workShift: "",
          email: "",
          role: "",
        }}
        validationSchema={stepSchemas[step - 1]}
        onSubmit={handleSubmit}
        validateOnChange={false}
        validateOnBlur={false}
      >
        {({ values, setFieldValue }) => (
          <Form className="pb-10">
            {/* STEP 1 */}
            {step === 1 && (
              <div className={cardCls}>
                <h2 className="text-2xl font-bold text-[#FFD700] mb-6 text-center">
                  Step 1: Personal Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* First Name */}
                  <div>
                    <ReqLabel>First Name</ReqLabel>
                    <input
                      name="firstName"
                      className={inputCls}
                      value={values.firstName}
                      onChange={(e) => {
  const input = e.target.value;
  if (/^[A-Za-z ]*$/.test(input)) {
    // Capitalize each word as user types
    const formatted = input
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
    setFieldValue("firstName", formatted);
  }
}}
                      placeholder="Enter first name"
                    />
                    <ErrorMessage
                      name="firstName"
                      component="div"
                      className="text-red-400 text-sm"
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <ReqLabel>Last Name</ReqLabel>
                    <input
                      name="lastName"
                      className={inputCls}
                      value={values.lastName}
                      onChange={(e) => {
  const input = e.target.value;
  if (/^[A-Za-z ]*$/.test(input)) {
    // Capitalize each word as user types
    const formatted = input
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
    setFieldValue("lastName", formatted);
  }
}}
                      placeholder="Enter last name"
                    />
                    <ErrorMessage
                      name="lastName"
                      component="div"
                      className="text-red-400 text-sm"
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <ReqLabel>Gender</ReqLabel>
                    <Field as="select" name="gender" className={inputCls}>
                      <option value="">Select...</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </Field>
                    <ErrorMessage
                      name="gender"
                      component="div"
                      className="text-red-400 text-sm"
                    />
                  </div>

                  {/* DOB */}
                  <div>
                    <ReqLabel>Date of Birth</ReqLabel>
                    <Field type="date" name="dob" className={`${inputCls} [color-scheme:dark] text-gray-700`}/>
                    <ErrorMessage
                      name="dob"
                      component="div"
                      className="text-red-400 text-sm"
                    />
                  </div>

                  {/* Phone */}
                  <div className="sm:col-span-2">
                    <ReqLabel>Phone Number</ReqLabel>
                    <input
                      name="phone"
                      maxLength="10"
                      className={inputCls}
                      value={values.phone}
                      onChange={(e) => {
                        if (/^[0-9]*$/.test(e.target.value))
                          setFieldValue("phone", e.target.value);
                      }}
                      placeholder="Enter 10-digit number"
                    />
                    <ErrorMessage
                      name="phone"
                      component="div"
                      className="text-red-400 text-sm"
                    />
                  </div>
                </div>
                <div className="text-center mt-8">
                  <button type="submit" className={btnPrimary}>
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className={cardCls}>
                <h2 className="text-2xl font-bold text-[#FFD700] mb-6 text-center">
                  Step 2: Job Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: "Department", name: "department" },
                    { label: "Designation", name: "designation" },
                    { label: "Work Location", name: "workLocation" },
                  ].map((f) => (
                    <div key={f.name}>
                      <ReqLabel>{f.label}</ReqLabel>
                      <input
                        name={f.name}
                        className={inputCls}
                        value={values[f.name]}
                        onChange={(e) => {
  const input = e.target.value;
  if (/^[A-Za-z ]*$/.test(input)) {
    // Capitalize each word as user types
    const formatted = input
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
    setFieldValue(f.name, formatted);
  }
}}
                        placeholder={`Enter ${f.label.toLowerCase()}`}
                      />
                      <ErrorMessage
                        name={f.name}
                        component="div"
                        className="text-red-400 text-sm"
                      />
                    </div>
                  ))}

                  <div>
                    <ReqLabel>Date of Joining</ReqLabel>
                    <Field type="date" name="joinDate" className={`${inputCls} [color-scheme:dark] text-gray-400`}/>
                    <ErrorMessage
                      name="joinDate"
                      component="div"
                      className="text-red-400 text-sm"
                    />
                  </div>

                  <div>
                    <ReqLabel>Employment Type</ReqLabel>
                    <Field
                      as="select"
                      name="employmentType"
                      className={inputCls}
                    >
                      <option value="">Select...</option>
                      <option value="Full-Time">Full-Time</option>
                      <option value="Part-Time">Part-Time</option>
                      <option value="Intern">Intern</option>
                    </Field>
                    <ErrorMessage
                      name="employmentType"
                      component="div"
                      className="text-red-400 text-sm"
                    />
                  </div>

                  <div>
                    <ReqLabel>Work Shift</ReqLabel>
                    <Field as="select" name="workShift" className={inputCls}>
                      <option value="">Select...</option>
                      <option value="Day">Day</option>
                      <option value="Night">Night</option>
                      <option value="Rotational">Rotational</option>
                    </Field>
                    <ErrorMessage
                      name="workShift"
                      component="div"
                      className="text-red-400 text-sm"
                    />
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className={btnSecondary}
                  >
                    Back
                  </button>
                  <button type="submit" className={btnPrimary}>
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className={cardCls}>
                <h2 className="text-2xl font-bold text-[#FFD700] mb-6 text-center">
                  Step 3: Login Credentials
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <ReqLabel>Email</ReqLabel>
                    <Field name="email" type="email" className={inputCls} />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-400 text-sm"
                    />
                  </div>
                  <div>
                    <ReqLabel>Role</ReqLabel>
                    <Field as="select" name="role" className={inputCls}>
                      <option value="">Select...</option>
                      <option value="employee">Employee</option>
                      <option value="manager">Manager</option>
                      <option value="hr">HR</option>
                    </Field>
                    <ErrorMessage
                      name="role"
                      component="div"
                      className="text-red-400 text-sm"
                    />
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className={btnSecondary}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`${btnPrimary} ${
                      isLoading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {isLoading ? "Submitting..." : "Continue"}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <div className={cardCls}>
                <h2 className="text-2xl font-bold text-[#FFD700] mb-6 text-center">
                  Review & Approve
                </h2>
                <div className="space-y-2 text-gray-300 text-sm sm:text-base">
                  <p>
                    <span className="text-[#FFD700] font-semibold">Name:</span>{" "}
                    {values.firstName} {values.lastName}
                  </p>
                  <p>
                    <span className="text-[#FFD700] font-semibold">
                      Department:
                    </span>{" "}
                    {values.department}
                  </p>
                  <p>
                    <span className="text-[#FFD700] font-semibold">
                      Designation:
                    </span>{" "}
                    {values.designation}
                  </p>
                  <p>
                    <span className="text-[#FFD700] font-semibold">
                      Joining Date:
                    </span>{" "}
                    {values.joinDate}
                  </p>
                  <p>
                    <span className="text-[#FFD700] font-semibold">Email:</span>{" "}
                    {values.email}
                  </p>
                  <p>
                    <span className="text-[#FFD700] font-semibold">Role:</span>{" "}
                    {values.role}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row justify-center sm:justify-between gap-3 mt-8 w-full">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#111] border border-[#FFD700]/50 text-white hover:border-[#FFD700] transition-all"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full sm:w-auto px-8 py-3 rounded-full bg-[#FFD700] text-black font-semibold hover:bg-[#f6ca00] transition-all ${
                      isLoading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {isLoading ? "Creating..." : "Approve & Create"}
                  </button>
                </div>
              </div>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
}
