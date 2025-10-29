// src/pages/SubmitFiles.jsx
import { Field, FieldArray, Form, Formik } from "formik";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "../../features/helpers/Toaster";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";
import { useCompleteOnboardingMutation } from "../../features/onboarding/onboardingApiSlice";
import {Eye, EyeOff} from "lucide-react";

export default function SubmitFiles() {
  const { selected } = useParams(); // fresher | experienced
  const isExperienced = selected === "experienced";
  const navigate = useNavigate();
  const token = localStorage.getItem("onboardToken");
  const [step, setStep] = useState(1);
  const [showWelcome, setShowWelcome] = useState(true);
  const [completeOnboarding, { isLoading }] = useCompleteOnboardingMutation();
  const [isSubmittingStep, setIsSubmittingStep] = useState(false);

  const [formikValues, setFormikValues] = useState({});

  const [showTemp, setShowTemp] = useState(false);
const [showNew, setShowNew] = useState(false);


  // LocalStorage Helpers
  const STORAGE_KEY = "onboardingStepData";

  const saveToLocal = (step, values) => {
    try {
      const clone = JSON.parse(JSON.stringify(values));

      if (clone.documents) {
        clone.documents.forEach((doc) => {
          delete doc.file;
          delete doc.fileData;
        });
      }

      // Retrieve previously saved data
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

      // Merge old and new data so previous step info stays
      const updated = {
        ...saved,
        [step]: { ...saved[step], ...clone },
        currentStep: step,
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.warn("Failed to save step data:", err);
    }
  };

  const loadFromLocal = () => {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      return data;
    } catch {
      return {};
    }
  };

  const clearLocal = () => {
    try {
      // remove main record
      localStorage.removeItem(STORAGE_KEY);

      // also remove any leftover docs saved individually
      Object.keys(localStorage)
        .filter((key) => key.startsWith("onboarding_doc_"))
        .forEach((key) => localStorage.removeItem(key));

      console.log("Onboarding local data cleared");
    } catch (err) {
      console.warn("Failed to clear onboarding data:", err);
    }
  };

  const [savedData, setSavedData] = useState({});
  const [savedStep, setSavedStep] = useState(1);

  useEffect(() => {
    const data = loadFromLocal();
    if (data) {
      setSavedData(data);
      if (data.currentStep) setStep(data.currentStep);
    }
  }, []);

  // Welcome animation
  useEffect(() => {
    const t = setTimeout(() => setShowWelcome(false), 800);
    return () => clearTimeout(t);
  }, []);

  // Safe File → Base64 converter
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      try {
        if (!file || !(file instanceof Blob)) {
          // not a real File/Blob — skip conversion
          resolve(null);
          return;
        }
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
      } catch (err) {
        resolve(null); // silently ignore non-files
      }
    });

  // Styles
  const labelCls = "block font-medium text-gray-300 mb-1.5";
  const inputCls =
    "w-full px-4 py-2.5 rounded-lg bg-[#111] text-white border border-[#FFD700]/30 focus:outline-none focus:border-[#FFD700] transition placeholder:text-gray-500";
  const errorCls = "text-red-400 text-sm mt-1";
  const cardBase =
    "relative rounded-2xl p-6 md:p-8 transition-all duration-300";
  const activeCard =
    "bg-[#0f0f0f] border border-[#FFD700]/40 shadow-[0_0_25px_rgba(255,215,0,0.15)]";

  // Validation schemas
  const schemaStep1 = Yup.object({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, "Phone must be 10 digits")
      .required("Phone is required"),
    dateOfBirth: Yup.date()
      .required("Date of Birth is required")
      .test("age", "Must be at least 18 years old", (value) => {
        if (!value) return false;
        const today = new Date();
        const dob = new Date(value);
        const age =
          today.getFullYear() -
          dob.getFullYear() -
          (today < new Date(today.getFullYear(), dob.getMonth(), dob.getDate())
            ? 1
            : 0);
        return age >= 18;
      }),
    gender: Yup.string().required("Gender is required"),
    bloodGroup: Yup.string().required("Blood group is required"),
    maritalStatus: Yup.string().required("Marital status is required"),
  });

  const schemaStep2 = Yup.object({
    profilePicture: Yup.mixed().required("Profile picture is required"),
  });

  const schemaStep3 = Yup.object({
    street: Yup.string().required("Street is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    pincode: Yup.string().required("Pincode is required"),
    country: Yup.string().required("Country is required"),
  });

  const schemaStep4 = Yup.object({
    emergencyName: Yup.string().required("Emergency contact name is required"),
    emergencyRelation: Yup.string().required("Relationship is required"),
    emergencyPhone: Yup.string()
      .matches(/^[0-9]{10}$/, "Phone must be 10 digits")
      .required("Emergency phone is required"),
  });

  const schemaStep5 = Yup.object({
    accountHolderName: Yup.string().required("Account holder name is required"),
    accountNumber: Yup.string().required("Account number is required"),
    bankName: Yup.string().required("Bank name is required"),
    ifscCode: Yup.string().required("IFSC code is required"),
    accountType: Yup.string().required("Account type is required"),
  });

  const schemaStep6 = Yup.object({
    education: Yup.array()
      .of(
        Yup.object({
          degree: Yup.string().required("Degree is required"),
          institution: Yup.string().required("Institution is required"),
          university: Yup.string().required("University/Board is required"),
          fieldOfStudy: Yup.string().required("Field of study is required"),
          startDate: Yup.date()
            .required("Start date is required")
            .max(new Date(), "Start date cannot be in the future"),

          endDate: Yup.date()
            .required("End date is required")
            .min(Yup.ref("startDate"), "End date cannot be before start date")
            .max(new Date(), "End date cannot be in the future"),
          grade: Yup.string().required("Grade/Percentage is required"),
        })
      )
      .min(1, "At least one education entry is required"),
  });

  const schemaStep7Experienced = Yup.object({
    experience: Yup.array()
      .of(
        Yup.object({
          company: Yup.string().required("Company name is required"),
          designation: Yup.string().required("Designation is required"),
          startDate: Yup.date()
            .required("Start date is required")
            .max(new Date(), "Start date cannot be in the future"),
          endDate: Yup.date()
            .nullable(true)
            .when("currentlyWorking", {
              is: (val) => val === false || val === "false",
              then: (schema) =>
                schema
                  .required("End date is required")
                  .min(
                    Yup.ref("startDate"),
                    "End date must be after start date"
                  ),
            })
            .min(Yup.ref("startDate"), "End date must be after start date"),
          responsibilities: Yup.string().required(
            "Responsibilities are required"
          ),
        })
      )
      .min(1, "At least one experience entry is required"),
  });

  const schemaStep8Skills = Yup.object({
    skills: Yup.array()
      .of(Yup.string().trim().required("Skill is required"))
      .min(1, "At least one skill is required")
      .test(
  "not-empty",
  "Please enter at least one valid skill",
  (arr) => Array.isArray(arr) && arr.some((v) => typeof v === "string" && v.trim() !== "")
)

  });

  const getDocumentsSchema = (educationArray) => {
    const requiredDocs = ["Aadhaar Card", "PAN Card"];

    educationArray.forEach((edu) => {
      if (edu.degree) requiredDocs.push(`${edu.degree} Certificate`);
    });

    if (isExperienced) {
      // use array-of-options for flexible matching
      requiredDocs.push(["Offer Letter", "Relieving Letter"]);
      requiredDocs.push("Experience Letter");
    }

    return Yup.object({
      documents: Yup.array()
        .of(
          Yup.object({
            type: Yup.string().required("Document type is required"),
            file: Yup.mixed().required("Document file is required"),
          })
        )
        .test("required-docs", "Missing required documents", function (docs) {
          if (!docs || docs.length === 0) {
            return this.createError({
              message:
                "Please upload all required documents: Aadhaar, PAN, and Certificates.",
            });
          }

          const uploadedTypes = docs
            .filter((d) => d.file)
            .map((d) => (d.type || "").trim().toLowerCase());

          // iterate all required docs
          for (const req of requiredDocs) {
            // handle either/or groups
            if (Array.isArray(req)) {
              const hasAny = req.some((opt) =>
                uploadedTypes.some((t) =>
                  t.includes(opt.toLowerCase().split(" ")[0])
                )
              );
              if (!hasAny) {
                return this.createError({
                  message: `${req.join(" or ")} is required`,
                });
              }
            } else {
              // normal required doc
              const hasMatch = uploadedTypes.some((t) =>
                t.includes(req.toLowerCase().split(" ")[0])
              );
              if (!hasMatch) {
                return this.createError({
                  message: `${req} is required`,
                });
              }
            }
          }

          return true;
        }),
    });
  };

  const schemaStep10Password = Yup.object({
    temporaryPassword: Yup.string().required("Temporary password is required"),
    newPassword: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("New password is required"),
  });

  const validationSchema = useMemo(() => {
    if (step === 1) return schemaStep1;
    if (step === 2) return schemaStep2;
    if (step === 3) return schemaStep3;
    if (step === 4) return schemaStep4;
    if (step === 5) return schemaStep5;
    if (step === 6) return schemaStep6;
    if (step === 7 && isExperienced) return schemaStep7Experienced;
    if ((step === 7 && !isExperienced) || (step === 8 && isExperienced))
      return schemaStep8Skills;

    // dynamically validate documents with required Aadhaar, PAN, degrees, etc.
    if ((step === 8 && !isExperienced) || (step === 9 && isExperienced))
      return getDocumentsSchema(formikValues?.education || []);

    if (step === 10 || (step === 9 && !isExperienced))
      return schemaStep10Password;

    return Yup.object({});
  }, [step, isExperienced, formikValues]);

  // Submit handler
  const handleSubmitStep = async (values) => {
    try {
      saveToLocal(step, values); // Save progress locally
      // toast.info(`Saving step ${step} data...`);

      let payload = { step: "", data: {}, finalStep: false };

      switch (step) {
        case 1:
          payload = {
            step: "personal_info",
            data: {
              firstName: values.firstName,
              lastName: values.lastName,
              email: values.email,
              phone: values.phone,
              dateOfBirth: values.dateOfBirth,
              gender: values.gender,
              bloodGroup: values.bloodGroup,
              maritalStatus: values.maritalStatus,
            },
          };
          break;

        case 2:
          if (values.profilePicture) {
            const fileData = await toBase64(values.profilePicture);
            payload = { step: "profile_picture", data: fileData };
          }
          break;

        case 3:
          payload = {
            step: "address",
            data: {
              address: {
                street: values.street,
                city: values.city,
                state: values.state,
                pincode: values.pincode,
                country: values.country,
              },
              permanentAddress: {
                street: values.street,
                city: values.city,
                state: values.state,
                pincode: values.pincode,
                country: values.country,
              },
            },
          };
          break;

        case 4:
          payload = {
            step: "emergency_contact",
            data: {
              name: values.emergencyName,
              relationship: values.emergencyRelation,
              phone: values.emergencyPhone,
              alternatePhone: values.emergencyAltPhone || "",
            },
          };
          break;

        case 5:
          payload = {
            step: "bank_details",
            data: {
              accountHolderName: values.accountHolderName,
              accountNumber: values.accountNumber,
              bankName: values.bankName,
              branchName: values.branchName || "",
              ifscCode: values.ifscCode,
              accountType: values.accountType,
            },
          };
          break;

        case 6:
          payload = {
            step: "education",
            data: values.education,
          };
          break;

        case 7:
          if (isExperienced)
            payload = {
              step: "experience",
              data: values.experience,
            };
          else
            payload = {
              step: "skills",
              data: values.skills,
            };
          break;

        case 8:
          if (isExperienced) {
            payload = { step: "skills", data: values.skills };
          } else {
            const documentsData = [];

            for (const doc of values.documents || []) {
              // 🧩 normalize invalid type names before sending
              let normalizedType = doc.type;
              let subType = doc.subType || "";

              if (doc.type && doc.type.endsWith("Certificate")) {
                normalizedType = "Educational Certificate";
                subType = doc.subType || doc.type.replace(" Certificate", "");
              }

              const base = {
                type: normalizedType || "Other",
                name: doc.name || doc.file?.name || "Unnamed",
                documentNumber: doc.documentNumber || "",
                expiryDate: doc.expiryDate || null,
                subType,
              };

              if (doc.fileData) {
                documentsData.push({ ...base, fileData: doc.fileData });
              } else if (doc.file && doc.file instanceof Blob) {
                const fileData = await toBase64(doc.file);
                if (fileData) documentsData.push({ ...base, fileData });
              }
            }

            payload = {
              step: "documents",
              data: documentsData,
              finalStep: false,
            };
          }
          break;

        case 9:
          if (isExperienced) {
            const documentsData = [];

            for (const doc of values.documents || []) {
              // normalize invalid type names before sending
              let normalizedType = doc.type;
              let subType = doc.subType || "";

              if (doc.type && doc.type.endsWith("Certificate")) {
                normalizedType = "Educational Certificate";
                subType = doc.subType || doc.type.replace(" Certificate", "");
              }

              const base = {
                type: normalizedType || "Other",
                name: doc.name || doc.file?.name || "Unnamed",
                documentNumber: doc.documentNumber || "",
                expiryDate: doc.expiryDate || null,
                subType,
              };

              if (doc.fileData) {
                documentsData.push({ ...base, fileData: doc.fileData });
              } else if (doc.file && doc.file instanceof Blob) {
                const fileData = await toBase64(doc.file);
                if (fileData) documentsData.push({ ...base, fileData });
              }
            }

            payload = {
              step: "documents",
              data: documentsData,
              finalStep: false,
            };
          } else {
            payload = {
              step: "password",
              data: {
                currentPassword: values.temporaryPassword,
                newPassword: values.newPassword,
              },
              finalStep: true,
            };
          }
          break;

        case 10:
          payload = {
            step: "password",
            data: {
              currentPassword: values.temporaryPassword,
              newPassword: values.newPassword,
            },
            finalStep: true,
          };
          break;

        default:
          return;
      }

      const result = await completeOnboarding({ token, payload }).unwrap();

      if (payload.finalStep) {
        // clear all onboarding data completely
        Object.keys(localStorage)
          .filter((k) => k.startsWith("onboarding_doc_") || k === STORAGE_KEY)
          .forEach((k) => localStorage.removeItem(k));

        toast.success("Onboarding completed!");
        clearLocal();
        navigate("/onboarding-success");
      } else {
        // toast.success(`Step ${step} saved successfully.`);
        toast.success(result?.message);
        saveToLocal(step, values);
        setStep((s) => s + 1);
      }
    } catch (err) {
      // Handle validation errors
      const validationError = err?.data?.data?.errors?.[0];
      // console.log(err?.data?.data)
      const backendMessage = err?.data?.message;

      if (validationError) {
        toast.error(validationError);
      } else if (backendMessage) {
        toast.error(backendMessage);
      } else {
        toast.error("Something went wrong!");
      }
    }
  };

  if (showWelcome) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#FFD700] mb-2 text-center">
          {isExperienced ? "Welcome Experienced!" : "Welcome Fresher!"}
        </h1>
        <p className="text-gray-400">Let's get you onboarded 🚀</p>
      </div>
    );
  }

  const totalSteps = isExperienced ? 10 : 9;

  const ErrorMessage = ({ name, formik }) => {
    const error = formik.errors[name];
    const touched = formik.touched[name];
    return touched && error ? <div className={errorCls}>{error}</div> : null;
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans px-4 sm:px-6 md:px-8 py-8 md:py-10">
      <ToastContainer position="top-right" autoClose={2200} theme="dark" />
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#FFD700] mb-2 text-center">
            {isExperienced ? "Experienced Onboarding" : "Fresher Onboarding"}
          </h1>
          <p className="text-gray-400 text-sm">
            Step {step} of {totalSteps} — complete each section to continue.
          </p>
        </header>

        <Formik
          enableReinitialize
          initialValues={{
            ...{
              firstName: "",
              lastName: "",
              email: "",
              phone: "",
              dateOfBirth: "",
              gender: "",
              bloodGroup: "",
              maritalStatus: "",
              street: "",
              city: "",
              state: "",
              pincode: "",
              country: "India",
              profilePicture: null,
              emergencyName: "",
              emergencyRelation: "",
              emergencyPhone: "",
              emergencyAltPhone: "",
              accountHolderName: "",
              accountNumber: "",
              bankName: "",
              branchName: "",
              ifscCode: "",
              accountType: "",
              education: [
                {
                  degree: "",
                  institution: "",
                  university: "",
                  fieldOfStudy: "",
                  startDate: "",
                  endDate: "",
                  grade: "",
                },
              ],
              experience: [
                {
                  company: "",
                  designation: "",
                  startDate: "",
                  endDate: "",
                  currentlyWorking: false,
                  responsibilities: "",
                  reasonForLeaving: "",
                },
              ],
              skills: [""],
              documents: [{ type: "", file: null }],
              temporaryPassword: "",
              newPassword: "",
            },
            ...savedData[step], // Prefill data from localStorage
          }}
          validationSchema={validationSchema}
          onSubmit={() => {}} // handled manually per step
        >
          {(formik) => {
            const { values, setFieldValue, errors, touched, validateForm } =
              formik;

            useEffect(() => {
              if (Object.keys(formikValues).length > 0) {
                saveToLocal(step, formikValues);
              }
            }, [formikValues, step]);

            useEffect(() => {
              setFormikValues(values);
            }, [values]);

            useEffect(() => {
              if (values.documents.length === 0) {
                setFieldValue("documents", [{ type: "", file: null }]);
              }
            }, [values.documents, setFieldValue]);

            const goNext = async () => {
              if (isSubmittingStep) return;
              setIsSubmittingStep(true);

              const errors = await formik.validateForm();
              if (Object.keys(errors).length) {
                formik.setTouched(
                  Object.keys(errors).reduce((acc, key) => {
                    acc[key] = true;
                    return acc;
                  }, {}),
                  false
                );
                toast.error("Please fill all required fields correctly.");
                setIsSubmittingStep(false);
                return;
              }

              await handleSubmitStep(values);
              setIsSubmittingStep(false);
            };

            const goBack = () => {
              setStep((s) => Math.max(1, s - 1));
              window.scrollTo({ top: 0, behavior: "smooth" });
            };

            return (
              <Form className="space-y-8">
                {/* STEP 1: Personal Details */}
                {step === 1 && (
                  <div className={`${cardBase} ${activeCard}`}>
                    <h3 className="text-lg sm:text-xl font-bold mb-6 text-[#FFD700]">
                      Personal Details
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className={labelCls}>
                          First Name <span className="text-red-400">*</span>
                        </label>
                        <Field name="firstName">
                          {({ field, form }) => (
                            <input
                              {...field}
                              placeholder="Enter first name"
                              className={inputCls}
                              onChange={(e) => {
                                const v = e.target.value;
                                if (/^[A-Za-z ]*$/.test(v))
                                  form.setFieldValue(
                                    "firstName",
                                    v
                                      .trim()
                                      .replace(/\b\w/g, (c) => c.toUpperCase())
                                  );
                              }}
                            />
                          )}
                        </Field>
                        <ErrorMessage name="firstName" formik={formik} />
                      </div>

                      <div>
                        <label className={labelCls}>
                          Last Name <span className="text-red-400">*</span>
                        </label>
                        <Field name="lastName">
                          {({ field, form }) => (
                            <input
                              {...field}
                              placeholder="Enter last name"
                              className={inputCls}
                              onChange={(e) => {
                                const v = e.target.value;
                                if (/^[A-Za-z ]*$/.test(v))
                                  form.setFieldValue(
                                    "lastName",
                                    v
                                      .trim()
                                      .replace(/\b\w/g, (c) => c.toUpperCase())
                                  );
                              }}
                            />
                          )}
                        </Field>

                        <ErrorMessage name="lastName" formik={formik} />
                      </div>

                      <div>
                        <label className={labelCls}>
                          Email <span className="text-red-400">*</span>
                        </label>
                        <Field name="email">
                          {({ field, form }) => (
                            <input
                              {...field}
                              type="email"
                              placeholder="Enter email"
                              className={inputCls}
                              onChange={(e) =>
                                form.setFieldValue(
                                  "email",
                                  e.target.value.toLowerCase()
                                )
                              }
                            />
                          )}
                        </Field>
                        <ErrorMessage name="email" formik={formik} />
                      </div>

                      <div>
                        <label className={labelCls}>
                          Phone Number <span className="text-red-400">*</span>
                        </label>
                        <Field name="phone">
                          {({ field, form }) => (
                            <input
                              {...field}
                              placeholder="10 digit number"
                              maxLength={10}
                              className={inputCls}
                              onChange={(e) => {
                                const v = e.target.value;
                                if (/^[0-9]*$/.test(v))
                                  form.setFieldValue("phone", v);
                              }}
                            />
                          )}
                        </Field>
                        <ErrorMessage name="phone" formik={formik} />
                      </div>

                      <div>
                        <label className={labelCls}>
                          Date of Birth <span className="text-red-400">*</span>
                        </label>
                        <Field
                          type="date"
                          name="dateOfBirth"
                          className={`${inputCls} [color-scheme:dark] text-white`}
                        />
                        <ErrorMessage name="dateOfBirth" formik={formik} />
                      </div>

                      <div>
                        <label className={labelCls}>
                          Gender <span className="text-red-400">*</span>
                        </label>
                        <Field as="select" name="gender" className={inputCls}>
                          <option value="">Select Gender</option>
                          <option>Male</option>
                          <option>Female</option>
                          <option>Other</option>
                        </Field>
                        <ErrorMessage name="gender" formik={formik} />
                      </div>

                      <div>
                        <label className={labelCls}>
                          Blood Group <span className="text-red-400">*</span>
                        </label>
                        <Field name="bloodGroup">
                          {({ field, form }) => (
                            <input
                              {...field}
                              maxLength={3}
                              placeholder="e.g., O+, A-, B+"
                              className={inputCls}
                              onChange={(e) => {
                                const v = e.target.value.toUpperCase();
                                if (/^[ABO+-]*$/.test(v))
                                  form.setFieldValue("bloodGroup", v);
                              }}
                            />
                          )}
                        </Field>
                        <ErrorMessage name="bloodGroup" formik={formik} />
                      </div>

                      <div>
                        <label className={labelCls}>
                          Marital Status <span className="text-red-400">*</span>
                        </label>
                        <Field
                          as="select"
                          name="maritalStatus"
                          className={inputCls}
                        >
                          <option value="">Select Marital Status</option>
                          <option>Single</option>
                          <option>Married</option>
                        </Field>
                        <ErrorMessage name="maritalStatus" formik={formik} />
                      </div>
                    </div>

                    <div className="flex justify-end pt-6">
                      <button
                        type="button"
                        onClick={goNext}
                        disabled={isSubmittingStep}
                        className={`w-full sm:w-auto px-6 sm:px-8 py-3 bg-[#FFD700] text-black font-bold rounded-lg transition ${
                          isSubmittingStep
                            ? "opacity-60 cursor-not-allowed"
                            : "hover:bg-[#FFC800]"
                        }`}
                      >
                        {isSubmittingStep ? "Saving..." : "Continue →"}
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: Profile Picture */}
                {step === 2 && (
                  <div
                    className={`${cardBase} ${activeCard} max-w-xl mx-auto w-full sm:w-[90%] md:w-[80%]`}
                  >
                    <h3 className="text-lg sm:text-xl font-bold mb-6 text-[#FFD700] text-center sm:text-left">
                      Upload Profile Picture
                    </h3>

                    <div className="space-y-5">
                      <div>
                        <label className={labelCls}>
                          Profile Image <span className="text-red-400">*</span>
                        </label>

                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) setFieldValue("profilePicture", file);
                          }}
                          className="text-sm text-gray-200 w-full sm:w-auto 
               file:mr-2 file:rounded-md file:bg-[#FFD700] 
               file:text-black file:font-semibold 
               [@media(max-width:768px)]:text-transparent"
                          style={{ cursor: "pointer" }}
                        />

                        {/* show filename cleanly below the input */}
                        {values.profilePicture && (
                          <p className="text-xs text-gray-400 mt-1">
                            Selected: {values.profilePicture.name}
                          </p>
                        )}

                        {touched.profilePicture && errors.profilePicture && (
                          <div className={errorCls}>
                            {errors.profilePicture}
                          </div>
                        )}
                      </div>

                      {values.profilePicture instanceof Blob && (
                        <div className="mt-3 flex flex-col sm:flex-col items-center gap-4">
                          <img
                            src={URL.createObjectURL(values.profilePicture)}
                            alt="Preview"
                            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 border-[#FFD700]/40 object-cover"
                          />
                          <p className="text-sm text-gray-400 sm:text-left text-center">
                            Preview of your selected image
                          </p>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row justify-center sm:justify-between gap-3 pt-6">
                        <button
                          type="button"
                          onClick={goBack}
                          className="w-full sm:w-auto px-6 py-3 border border-[#FFD700]/40 text-gray-300 rounded-lg hover:border-[#FFD700] transition"
                        >
                          ← Back
                        </button>

                        <button
                          type="button"
                          onClick={goNext}
                          disabled={isSubmittingStep}
                          className={`w-full sm:w-auto px-6 sm:px-8 py-3 bg-[#FFD700] text-black font-bold rounded-lg transition ${
                            isSubmittingStep
                              ? "opacity-60 cursor-not-allowed"
                              : "hover:bg-[#FFC800]"
                          }`}
                        >
                          {isSubmittingStep ? "Saving..." : "Continue →"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: Address */}
                {step === 3 && (
                  <div className={`${cardBase} ${activeCard}`}>
                    <h3 className="text-lg sm:text-xl font-bold mb-6 text-[#FFD700]">
                      Address Details
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="md:col-span-2">
                        <label className={labelCls}>
                          Street Address <span className="text-red-400">*</span>
                        </label>
                        <Field name="street">
                          {({ field, form }) => (
                            <input
                              {...field}
                              placeholder="Enter street address"
                              className={inputCls}
                              onChange={(e) => {
                                const v = e.target.value;
                                if (/^[A-Za-z0-9 /,.-]*$/.test(v))
                                  form.setFieldValue(
                                    "street",
                                    v
                                      // .trim()
                                      .replace(/\b\w/g, (c) => c.toUpperCase())
                                  );
                              }}
                            />
                          )}
                        </Field>
                        <ErrorMessage name="street" formik={formik} />
                      </div>

                      <div>
                        <label className={labelCls}>
                          City <span className="text-red-400">*</span>
                        </label>
                        <Field name="city">
                          {({ field, form }) => (
                            <input
                              {...field}
                              placeholder="Enter city"
                              className={inputCls}
                              onChange={(e) => {
                                const v = e.target.value;
                                if (/^[A-Za-z ]*$/.test(v))
                                  form.setFieldValue(
                                    "city",
                                    v
                                      .trim()
                                      .replace(/\b\w/g, (c) => c.toUpperCase())
                                  );
                              }}
                            />
                          )}
                        </Field>
                        <ErrorMessage name="city" formik={formik} />
                      </div>

                      <div>
                        <label className={labelCls}>
                          State <span className="text-red-400">*</span>
                        </label>
                        <Field name="state">
                          {({ field, form }) => (
                            <input
                              {...field}
                              placeholder="Enter state"
                              className={inputCls}
                              onChange={(e) => {
                                const v = e.target.value;
                                if (/^[A-Za-z ]*$/.test(v))
                                  form.setFieldValue(
                                    "state",
                                    v
                                      .trim()
                                      .replace(/\b\w/g, (c) => c.toUpperCase())
                                  );
                              }}
                            />
                          )}
                        </Field>
                        <ErrorMessage name="state" formik={formik} />
                      </div>

                      <div>
                        <label className={labelCls}>
                          Pincode <span className="text-red-400">*</span>
                        </label>
                        <Field name="pincode">
                          {({ field, form }) => (
                            <input
                              {...field}
                              placeholder="Enter pincode"
                              maxLength={6}
                              className={inputCls}
                              onChange={(e) => {
                                const v = e.target.value;
                                if (/^[0-9]*$/.test(v))
                                  form.setFieldValue("pincode", v);
                              }}
                            />
                          )}
                        </Field>
                        <ErrorMessage name="pincode" formik={formik} />
                      </div>

                      <div>
                        <label className={labelCls}>
                          Country <span className="text-red-400">*</span>
                        </label>
                        <Field name="country">
                          {({ field, form }) => (
                            <input
                              {...field}
                              placeholder="Enter country"
                              className={inputCls}
                              onChange={(e) => {
                                const v = e.target.value;
                                if (/^[A-Za-z ]*$/.test(v))
                                  form.setFieldValue(
                                    "country",
                                    v
                                      .trim()
                                      .replace(/\b\w/g, (c) => c.toUpperCase())
                                  );
                              }}
                            />
                          )}
                        </Field>
                        <ErrorMessage name="country" formik={formik} />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between gap-3 pt-6">
                      <button
                        type="button"
                        onClick={goBack}
                        className="w-full sm:w-auto px-6 sm:px-8 py-3 border border-[#FFD700]/40 text-gray-300 rounded-lg hover:border-[#FFD700] transition"
                      >
                        ← Back
                      </button>

                      <button
                        type="button"
                        onClick={goNext}
                        disabled={isSubmittingStep}
                        className={`w-full sm:w-auto px-6 sm:px-8 py-3 bg-[#FFD700] text-black font-bold rounded-lg transition ${
                          isSubmittingStep
                            ? "opacity-60 cursor-not-allowed"
                            : "hover:bg-[#FFC800]"
                        }`}
                      >
                        {isSubmittingStep ? "Saving..." : "Continue →"}
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 4: Emergency Contact */}
                {step === 4 && (
                  <div className={`${cardBase} ${activeCard}`}>
                    <h3 className="text-lg sm:text-xl font-bold mb-6 text-[#FFD700]">
                      Emergency Contact
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className={labelCls}>
                          Contact Person Name{" "}
                          <span className="text-red-400">*</span>
                        </label>
                        <Field name="emergencyName">
                          {({ field, form }) => (
                            <input
                              {...field}
                              placeholder="Full name"
                              className={inputCls}
                              onChange={(e) => {
                                const v = e.target.value;
                                if (/^[A-Za-z ]*$/.test(v))
                                  form.setFieldValue(
                                    "emergencyName",
                                    v
                                      .trim()
                                      .replace(/\b\w/g, (c) => c.toUpperCase())
                                  );
                              }}
                            />
                          )}
                        </Field>
                        <ErrorMessage name="emergencyName" formik={formik} />
                      </div>

                      <div>
                        <label className={labelCls}>
                          Relationship <span className="text-red-400">*</span>
                        </label>
                        <Field name="emergencyRelation">
                          {({ field, form }) => (
                            <input
                              {...field}
                              placeholder="e.g., Father, Mother"
                              className={inputCls}
                              onChange={(e) => {
                                const v = e.target.value;
                                if (/^[A-Za-z ]*$/.test(v))
                                  form.setFieldValue(
                                    "emergencyRelation",
                                    v
                                      .trim()
                                      .replace(/\b\w/g, (c) => c.toUpperCase())
                                  );
                              }}
                            />
                          )}
                        </Field>
                        <ErrorMessage
                          name="emergencyRelation"
                          formik={formik}
                        />
                      </div>

                      <div>
                        <label className={labelCls}>
                          Phone Number <span className="text-red-400">*</span>
                        </label>
                        <Field name="emergencyPhone">
                          {({ field, form }) => (
                            <input
                              {...field}
                              placeholder="10 digit number"
                              maxLength={10}
                              className={inputCls}
                              onChange={(e) => {
                                const v = e.target.value;
                                if (/^[0-9]*$/.test(v))
                                  form.setFieldValue("emergencyPhone", v);
                              }}
                            />
                          )}
                        </Field>
                        <ErrorMessage name="emergencyPhone" formik={formik} />
                      </div>

                      <div>
                        <label className={labelCls}>
                          Alternate Phone (Optional)
                        </label>
                        <Field name="emergencyAltPhone">
                          {({ field, form }) => (
                            <input
                              {...field}
                              placeholder="Optional"
                              maxLength={10}
                              className={inputCls}
                              onChange={(e) => {
                                const v = e.target.value;
                                if (/^[0-9]*$/.test(v))
                                  form.setFieldValue("emergencyAltPhone", v);
                              }}
                            />
                          )}
                        </Field>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between gap-3 pt-6">
                      <button
                        type="button"
                        onClick={goBack}
                        className="w-full sm:w-auto px-6 sm:px-8 py-3 border border-[#FFD700]/40 text-gray-300 rounded-lg hover:border-[#FFD700] transition"
                      >
                        ← Back
                      </button>

                      <button
                        type="button"
                        onClick={goNext}
                        disabled={isSubmittingStep}
                        className={`w-full sm:w-auto px-6 sm:px-8 py-3 bg-[#FFD700] text-black font-bold rounded-lg transition ${
                          isSubmittingStep
                            ? "opacity-60 cursor-not-allowed"
                            : "hover:bg-[#FFC800]"
                        }`}
                      >
                        {isSubmittingStep ? "Saving..." : "Continue →"}
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 5: Bank Details */}
                {step === 5 && (
                  <div className={`${cardBase} ${activeCard}`}>
                    <h3 className="text-lg sm:text-xl font-bold mb-6 text-[#FFD700]">
                      Bank Details
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className={labelCls}>
                          Account Holder Name{" "}
                          <span className="text-red-400">*</span>
                        </label>
                        <Field name="accountHolderName">
                          {({ field, form }) => (
                            <input
                              {...field}
                              placeholder="As per bank records"
                              className={inputCls}
                              onChange={(e) => {
                                const v = e.target.value;
                                if (/^[A-Za-z ]*$/.test(v))
                                  form.setFieldValue(
                                    "accountHolderName",
                                    v
                                    // .replace(/\b\w/g, (c) => c.toUpperCase())
                                  );
                              }}
                            />
                          )}
                        </Field>
                        <ErrorMessage
                          name="accountHolderName"
                          formik={formik}
                        />
                      </div>

                      <div>
                        <label className={labelCls}>
                          Account Number <span className="text-red-400">*</span>
                        </label>
                        <Field name="accountNumber">
                          {({ field, form }) => (
                            <input
                              {...field}
                              placeholder="Enter account number"
                              maxLength={18}
                              className={inputCls}
                              onChange={(e) => {
                                const v = e.target.value;
                                if (/^[0-9]*$/.test(v))
                                  form.setFieldValue("accountNumber", v);
                              }}
                            />
                          )}
                        </Field>
                        <ErrorMessage name="accountNumber" formik={formik} />
                      </div>

                      <div>
                        <label className={labelCls}>
                          Bank Name <span className="text-red-400">*</span>
                        </label>
                        <Field name="bankName">
                          {({ field, form }) => (
                            <input
                              {...field}
                              placeholder="e.g., SBI, HDFC, ICICI"
                              className={inputCls}
                              onChange={(e) => {
                                const v = e.target.value.toUpperCase();
                                if (/^[A-Z ]*$/.test(v))
                                  form.setFieldValue("bankName", v);
                              }}
                            />
                          )}
                        </Field>

                        <ErrorMessage name="bankName" formik={formik} />
                      </div>

                      <div>
                        <label className={labelCls}>
                          Branch Name (Optional)
                        </label>
                        <Field name="branchName">
                          {({ field, form }) => (
                            <input
                              {...field}
                              placeholder="Enter branch name"
                              className={inputCls}
                              onChange={(e) => {
                                const v = e.target.value;
                                if (/^[A-Za-z0-9 ,.-]*$/.test(v))
                                  form.setFieldValue(
                                    "branchName",
                                    v
                                      .trim()
                                      .replace(/\b\w/g, (c) => c.toUpperCase())
                                  );
                              }}
                            />
                          )}
                        </Field>
                      </div>

                      <div>
                        <label className={labelCls}>
                          IFSC Code <span className="text-red-400">*</span>
                        </label>
                        <Field name="ifscCode">
                          {({ field, form }) => (
                            <input
                              {...field}
                              placeholder="e.g., SBIN0001234"
                              maxLength={11}
                              className={inputCls}
                              onChange={(e) =>
                                form.setFieldValue(
                                  "ifscCode",
                                  e.target.value.toUpperCase()
                                )
                              }
                            />
                          )}
                        </Field>
                        <ErrorMessage name="ifscCode" formik={formik} />
                      </div>

                      <div>
                        <label className={labelCls}>
                          Account Type <span className="text-red-400">*</span>
                        </label>
                        <Field
                          as="select"
                          name="accountType"
                          className={inputCls}
                        >
                          <option value="">Select Account Type</option>
                          <option>Savings</option>
                          <option>Current</option>
                        </Field>
                        <ErrorMessage name="accountType" formik={formik} />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between gap-3 pt-6">
                      <button
                        type="button"
                        onClick={goBack}
                        className="w-full sm:w-auto px-6 sm:px-8 py-3 border border-[#FFD700]/40 text-gray-300 rounded-lg hover:border-[#FFD700] transition"
                      >
                        ← Back
                      </button>

                      <button
                        type="button"
                        onClick={goNext}
                        disabled={isSubmittingStep}
                        className={`w-full sm:w-auto px-6 sm:px-8 py-3 bg-[#FFD700] text-black font-bold rounded-lg transition ${
                          isSubmittingStep
                            ? "opacity-60 cursor-not-allowed"
                            : "hover:bg-[#FFC800]"
                        }`}
                      >
                        {isSubmittingStep ? "Saving..." : "Continue →"}
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 6: Education */}
                {step === 6 && (
                  <div className={`${cardBase} ${activeCard}`}>
                    <h3 className="text-lg sm:text-xl font-bold mb-1 text-[#FFD700]">
                      Education Details
                    </h3>
                    <p class="text-sm text-gray-400 mt-2 mb-4">
                      <span class="font-medium text-[#FFD700]">Note:</span> If a
                      required field is not applicable or data is unavailable,
                      please enter <strong>N/A</strong>.
                    </p>

                    <FieldArray
                      name="education"
                      render={(arrayHelpers) => (
                        <div>
                          {values.education.map((edu, i) => (
                            <div
                              key={i}
                              className="border border-[#FFD700]/30 p-5 rounded-lg mb-4 bg-[#0a0a0a]"
                            >
                              <h4 className="text-sm font-semibold text-gray-300 mb-3">
                                Education Entry #{i + 1}
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div>
                                  <label className={labelCls}>
                                    Degree{" "}
                                    <span className="text-red-400">*</span>
                                  </label>
                                  <Field
                                    as="select"
                                    name={`education.${i}.degree`}
                                    className={inputCls}
                                  >
                                    <option value="">Select Degree</option>
                                    <option>10th</option>
                                    <option>12th</option>
                                    <option>Diploma</option>
                                    <option>Bachelor's</option>
                                    <option>Master's</option>
                                    <option>PhD</option>
                                  </Field>
                                  {touched.education?.[i]?.degree &&
                                    errors.education?.[i]?.degree && (
                                      <div className={errorCls}>
                                        {errors.education[i].degree}
                                      </div>
                                    )}
                                </div>

                                <div>
                                  <label className={labelCls}>
                                    Institution{" "}
                                    <span className="text-red-400">*</span>
                                  </label>
                                  <Field
                                    name={`education.${i}.institution`}
                                    placeholder="School/College name"
                                    className={inputCls}
                                  />
                                  {touched.education?.[i]?.institution &&
                                    errors.education?.[i]?.institution && (
                                      <div className={errorCls}>
                                        {errors.education[i].institution}
                                      </div>
                                    )}
                                </div>

                                <div>
                                  <label className={labelCls}>
                                    University/Board{" "}
                                    <span className="text-red-400">*</span>
                                  </label>
                                  <Field
                                    name={`education.${i}.university`}
                                    placeholder="e.g., CBSE, JNTU, etc."
                                    className={inputCls}
                                  />
                                  {touched.education?.[i]?.university &&
                                    errors.education?.[i]?.university && (
                                      <div className={errorCls}>
                                        {errors.education[i].university}
                                      </div>
                                    )}
                                </div>

                                <div>
                                  <label className={labelCls}>
                                    Field of Study{" "}
                                    <span className="text-red-400">*</span>
                                  </label>

                                  <Field name={`education.${i}.fieldOfStudy`}>
                                    {({ field, form }) => (
                                      <input
                                        {...field}
                                        placeholder="e.g., Science, CSE, etc."
                                        className={inputCls}
                                        onChange={(e) => {
                                          const v = e.target.value;
                                          if (/^[A-Za-z / ]*$/.test(v)) {
                                            form.setFieldValue(
                                              `education.${i}.fieldOfStudy`,
                                              v
                                                .trimStart()
                                                .replace(/\b\w/g, (c) =>
                                                  c.toUpperCase()
                                                ) // capitalize each word
                                            );
                                          }
                                        }}
                                      />
                                    )}
                                  </Field>

                                  {touched.education?.[i]?.fieldOfStudy &&
                                    errors.education?.[i]?.fieldOfStudy && (
                                      <div className={errorCls}>
                                        {errors.education[i].fieldOfStudy}
                                      </div>
                                    )}
                                </div>

                                <div>
                                  <label className={labelCls}>
                                    Start Date{" "}
                                    <span className="text-red-400">*</span>
                                  </label>
                                  <Field
                                    type="date"
                                    name={`education.${i}.startDate`}
                                    className={`${inputCls} [color-scheme:dark] text-white`}
                                  />
                                  {touched.education?.[i]?.startDate &&
                                    errors.education?.[i]?.startDate && (
                                      <div className={errorCls}>
                                        {errors.education[i].startDate}
                                      </div>
                                    )}
                                </div>

                                <div>
                                  <label className={labelCls}>
                                    End Date{" "}
                                    <span className="text-red-400">*</span>
                                  </label>
                                  <Field
                                    type="date"
                                    name={`education.${i}.endDate`}
                                    className={`${inputCls} [color-scheme:dark] text-white`}
                                  />
                                  {touched.education?.[i]?.endDate &&
                                    errors.education?.[i]?.endDate && (
                                      <div className={errorCls}>
                                        {errors.education[i].endDate}
                                      </div>
                                    )}
                                </div>

                                <div>
                                  <label className={labelCls}>
                                    Grade/Percentage{" "}
                                    <span className="text-red-400">*</span>
                                  </label>
                                  <Field name={`education.${i}.grade`}>
                                    {({ field, form }) => (
                                      <input
                                        {...field}
                                        placeholder="e.g., 85%, 8.5, 92.3%"
                                        className={inputCls}
                                        onChange={(e) => {
                                          const v = e.target.value;
                                          // allow only digits, dot, and percentage
                                          if (/^[0-9.%]*$/.test(v)) {
                                            form.setFieldValue(
                                              `education.${i}.grade`,
                                              v
                                            );
                                          }
                                        }}
                                      />
                                    )}
                                  </Field>
                                  {touched.education?.[i]?.grade &&
                                    errors.education?.[i]?.grade && (
                                      <div className={errorCls}>
                                        {errors.education[i].grade}
                                      </div>
                                    )}
                                </div>
                              </div>

                              {values.education.length > 1 && (
                                <button
                                  type="button"
                                  className="text-red-400 text-sm mt-3 hover:text-red-300"
                                  onClick={() => arrayHelpers.remove(i)}
                                >
                                  ✕ Remove Entry
                                </button>
                              )}
                            </div>
                          ))}

                          <button
                            type="button"
                            className="mt-2 text-[#FFD700] hover:text-[#FFC800] font-medium"
                            onClick={() =>
                              arrayHelpers.push({
                                degree: "",
                                institution: "",
                                university: "",
                                fieldOfStudy: "",
                                startDate: "",
                                endDate: "",
                                grade: "",
                              })
                            }
                          >
                            + Add More Education
                          </button>
                        </div>
                      )}
                    />

                    <div className="flex flex-col sm:flex-row justify-between gap-3 pt-6">
                      <button
                        type="button"
                        onClick={goBack}
                        className="w-full sm:w-auto px-6 sm:px-8 py-3 border border-[#FFD700]/40 text-gray-300 rounded-lg hover:border-[#FFD700] transition"
                      >
                        ← Back
                      </button>

                      <button
                        type="button"
                        onClick={goNext}
                        disabled={isSubmittingStep}
                        className={`w-full sm:w-auto px-6 sm:px-8 py-3 bg-[#FFD700] text-black font-bold rounded-lg transition ${
                          isSubmittingStep
                            ? "opacity-60 cursor-not-allowed"
                            : "hover:bg-[#FFC800]"
                        }`}
                      >
                        {isSubmittingStep ? "Saving..." : "Continue →"}
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 7: Experience (experienced only) */}
                {isExperienced && step === 7 && (
                  <div className={`${cardBase} ${activeCard}`}>
                    <h3 className="text-lg sm:text-xl font-bold mb-6 text-[#FFD700]">
                      Work Experience
                    </h3>
                    <FieldArray
                      name="experience"
                      render={(arrayHelpers) => (
                        <div>
                          {values.experience.map((exp, i) => (
                            <div
                              key={i}
                              className="border border-[#FFD700]/30 p-5 rounded-lg mb-4 bg-[#0a0a0a]"
                            >
                              <h4 className="text-sm font-semibold text-gray-300 mb-3">
                                Experience Entry #{i + 1}
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div>
                                  <label className={labelCls}>
                                    Company Name{" "}
                                    <span className="text-red-400">*</span>
                                  </label>
                                  <Field
                                    name={`experience.${i}.company`}
                                    placeholder="Company name"
                                    className={inputCls}
                                  />
                                  {touched.experience?.[i]?.company &&
                                    errors.experience?.[i]?.company && (
                                      <div className={errorCls}>
                                        {errors.experience[i].company}
                                      </div>
                                    )}
                                </div>

                                <div>
                                  <label className={labelCls}>
                                    Designation{" "}
                                    <span className="text-red-400">*</span>
                                  </label>
                                  <Field
                                    name={`experience.${i}.designation`}
                                    placeholder="Job title"
                                    className={inputCls}
                                  />
                                  {touched.experience?.[i]?.designation &&
                                    errors.experience?.[i]?.designation && (
                                      <div className={errorCls}>
                                        {errors.experience[i].designation}
                                      </div>
                                    )}
                                </div>

                                <div>
                                  <label className={labelCls}>
                                    Start Date{" "}
                                    <span className="text-red-400">*</span>
                                  </label>
                                  <Field
                                    type="date"
                                    name={`experience.${i}.startDate`}
                                    className={inputCls}
                                  />
                                  {touched.experience?.[i]?.startDate &&
                                    errors.experience?.[i]?.startDate && (
                                      <div className={errorCls}>
                                        {errors.experience[i].startDate}
                                      </div>
                                    )}
                                </div>

                                <div>
                                  <label className={labelCls}>
                                    End Date{" "}
                                    {!exp.currentlyWorking && (
                                      <span className="text-red-400">*</span>
                                    )}
                                  </label>
                                  <Field
                                    type="date"
                                    name={`experience.${i}.endDate`}
                                    disabled={exp.currentlyWorking}
                                    className={inputCls}
                                  />
                                  {touched.experience?.[i]?.endDate &&
                                    errors.experience?.[i]?.endDate && (
                                      <div className={errorCls}>
                                        {errors.experience[i].endDate}
                                      </div>
                                    )}
                                </div>

                                <div className="md:col-span-2">
                                  <label className="flex items-center gap-2 text-gray-300">
                                    <Field
                                      type="checkbox"
                                      name={`experience.${i}.currentlyWorking`}
                                      className="w-4 h-4"
                                    />
                                    Currently Working Here
                                  </label>
                                </div>

                                <div className="md:col-span-2">
                                  <label className={labelCls}>
                                    Responsibilities{" "}
                                    <span className="text-red-400">*</span>
                                  </label>
                                  <Field
                                    as="textarea"
                                    name={`experience.${i}.responsibilities`}
                                    placeholder="Describe your key responsibilities and achievements"
                                    className={`${inputCls} h-24`}
                                  />
                                  {touched.experience?.[i]?.responsibilities &&
                                    errors.experience?.[i]
                                      ?.responsibilities && (
                                      <div className={errorCls}>
                                        {errors.experience[i].responsibilities}
                                      </div>
                                    )}
                                </div>

                                <div className="md:col-span-2">
                                  <label className={labelCls}>
                                    Reason for Leaving (Optional)
                                  </label>
                                  <Field
                                    name={`experience.${i}.reasonForLeaving`}
                                    placeholder="Optional"
                                    className={inputCls}
                                  />
                                </div>
                              </div>

                              {values.experience.length > 1 && (
                                <button
                                  type="button"
                                  className="text-red-400 text-sm mt-3 hover:text-red-300"
                                  onClick={() => arrayHelpers.remove(i)}
                                >
                                  ✕ Remove Entry
                                </button>
                              )}
                            </div>
                          ))}

                          <button
                            type="button"
                            className="mt-2 text-[#FFD700] hover:text-[#FFC800] font-medium"
                            onClick={() =>
                              arrayHelpers.push({
                                company: "",
                                designation: "",
                                startDate: "",
                                endDate: "",
                                currentlyWorking: false,
                                responsibilities: "",
                                reasonForLeaving: "",
                              })
                            }
                          >
                            + Add More Experience
                          </button>
                        </div>
                      )}
                    />

                    <div className="flex flex-col sm:flex-row justify-between gap-3 pt-6">
                      <button
                        type="button"
                        onClick={goBack}
                        className="w-full sm:w-auto px-6 sm:px-8 py-3 border border-[#FFD700]/40 text-gray-300 rounded-lg hover:border-[#FFD700] transition"
                      >
                        ← Back
                      </button>

                      <button
                        type="button"
                        onClick={goNext}
                        disabled={isSubmittingStep}
                        className={`w-full sm:w-auto px-6 sm:px-8 py-3 bg-[#FFD700] text-black font-bold rounded-lg transition ${
                          isSubmittingStep
                            ? "opacity-60 cursor-not-allowed"
                            : "hover:bg-[#FFC800]"
                        }`}
                      >
                        {isSubmittingStep ? "Saving..." : "Continue →"}
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 8: Skills */}
                {((step === 7 && !isExperienced) ||
                  (step === 8 && isExperienced)) && (
                  <div className={`${cardBase} ${activeCard}`}>
                    <h3 className="text-lg sm:text-xl font-bold mb-6 text-[#FFD700]">
                      Skills
                    </h3>
                    <FieldArray
                      name="skills"
                      render={(arrayHelpers) => (
                        <div>
                          {values.skills.map((skill, i) => (
                            <div key={i} className="flex gap-3 mb-3">
                              <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-300 mb-1">
  Skill {i + 1} {i === 0 && <span className="text-red-400">*</span>}
</label>

                                <Field
                                  name={`skills.${i}`}
                                  placeholder={`Skill ${i + 1}`}
                                  className={inputCls}
                                />
                                {touched.skills?.[i] && errors.skills?.[i] && (
                                  <div className={errorCls}>
                                    {errors.skills[i]}
                                  </div>
                                )}
                              </div>
                              {values.skills.length > 1 && (
                                <button
                                  type="button"
                                  className="text-red-400 hover:text-red-300 px-3"
                                  onClick={() => arrayHelpers.remove(i)}
                                >
                                  ✕
                                </button>
                              )}
                            </div>
                          ))}

                          <button
                            type="button"
                            className="mt-2 text-[#FFD700] hover:text-[#FFC800] font-medium"
                            onClick={() => arrayHelpers.push("")}
                          >
                            + Add More Skills
                          </button>
                        </div>
                      )}
                    />

                    <div className="flex flex-col sm:flex-row justify-between gap-3 pt-6">
                      <button
                        type="button"
                        onClick={goBack}
                        className="w-full sm:w-auto px-6 sm:px-8 py-3 border border-[#FFD700]/40 text-gray-300 rounded-lg hover:border-[#FFD700] transition"
                      >
                        ← Back
                      </button>

                      <button
                        type="button"
                        disabled={isSubmittingStep}
                        onClick={async () => {
                          const errors = await validateForm();
                          const hasErrors = Object.keys(errors).length > 0;

                          if (hasErrors) {
                            toast.error(
                              "Please add at least one valid skill before continuing."
                            );
                            return;
                          }

                          goNext();
                        }}
                        className={`w-full sm:w-auto px-6 sm:px-8 py-3 bg-[#FFD700] text-black font-bold rounded-lg transition ${
                          isSubmittingStep
                            ? "opacity-60 cursor-not-allowed"
                            : "hover:bg-[#FFC800]"
                        }`}
                      >
                        {isSubmittingStep ? "Saving..." : "Continue →"}
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 9: Documents */}
                {((step === 8 && !isExperienced) ||
                  (step === 9 && isExperienced)) && (
                  <div className={`${cardBase} ${activeCard}`}>
                    <h3 className="text-lg sm:text-xl font-bold mb-6 text-[#FFD700]">
                      Upload Documents
                    </h3>

                    <div className="bg-[#0a0a0a] border border-[#FFD700]/20 rounded-lg p-4 mb-6">
                      <h4 className="font-semibold text-gray-200 mb-2">
                        Required Documents:
                      </h4>
                      <ul className="text-sm text-gray-400 space-y-1 list-disc list-inside pl-2 leading-relaxed">
                        <li>
                          Aadhaar Card <span className="text-red-400">*</span>
                        </li>
                        <li>
                          PAN Card <span className="text-red-400">*</span>
                        </li>
                        {values.education && values.education.length > 0 ? (
                          values.education.map(
                            (edu, idx) =>
                              edu.degree && (
                                <li key={idx}>
                                  {edu.degree} Certificate{" "}
                                  <span className="text-red-400">*</span>
                                </li>
                              )
                          )
                        ) : (
                          <li className="text-gray-500 italic">
                            No education details added yet.
                          </li>
                        )}

                        {isExperienced && (
                          <>
                            <li>
                              Offer / Relieving Letter{" "}
                              <span className="text-red-400">*</span>
                            </li>
                            <li>
                              Experience Letter{" "}
                              <span className="text-red-400">*</span>
                            </li>
                          </>
                        )}
                      </ul>
                      <p className="text-xs text-gray-500 mt-3">
                        Optional: Passport, Driving License, Other certificates
                      </p>
                    </div>

                    <FieldArray
                      name="documents"
                      render={(arrayHelpers) => (
                        <div>
                          {values.documents.map((doc, i) => (
                            <div
                              key={i}
                              className="border border-[#FFD700]/30 p-4 rounded-lg mb-4 bg-[#0a0a0a]"
                            >
                              <div className="space-y-3">
                                <div>
                                  <label className={labelCls}>
                                    Document Type{" "}
                                    <span className="text-red-400">*</span>
                                  </label>
                                  <Field
                                    as="select"
                                    name={`documents.${i}.type`}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setFieldValue(`documents.${i}.type`, val);
                                      // derive subType later or store temporarily for UI
                                      if (val.endsWith("Certificate")) {
                                        setFieldValue(
                                          `documents.${i}.subType`,
                                          val.replace(" Certificate", "")
                                        );
                                      } else {
                                        setFieldValue(
                                          `documents.${i}.subType`,
                                          ""
                                        );
                                      }
                                    }}
                                    className={inputCls}
                                  >
                                    <option value="">
                                      Select Document Type
                                    </option>
                                    <option value="Aadhaar">
                                      Aadhaar Card
                                    </option>
                                    <option value="PAN">PAN Card</option>

                                    {/* dynamic list from education step */}
                                    {values.education.map(
                                      (edu, idx) =>
                                        edu.degree && (
                                          <option
                                            key={`edu-${idx}`}
                                            value={`${edu.degree} Certificate`}
                                          >
                                            {edu.degree} Certificate
                                          </option>
                                        )
                                    )}

                                    {/* fallback static list (only if not in education array) */}
                                    {!values.education.some(
                                      (e) => e.degree === "10th"
                                    ) && (
                                      <option value="10th Certificate">
                                        10th Certificate
                                      </option>
                                    )}
                                    {!values.education.some(
                                      (e) => e.degree === "12th"
                                    ) && (
                                      <option value="12th Certificate">
                                        12th Certificate
                                      </option>
                                    )}
                                    {!values.education.some(
                                      (e) => e.degree === "Diploma"
                                    ) && (
                                      <option value="Diploma Certificate">
                                        Diploma Certificate
                                      </option>
                                    )}
                                    {!values.education.some(
                                      (e) => e.degree === "Bachelor's"
                                    ) && (
                                      <option value="Bachelor's Certificate">
                                        Bachelor's Certificate
                                      </option>
                                    )}
                                    {!values.education.some(
                                      (e) => e.degree === "Master's"
                                    ) && (
                                      <option value="Master's Certificate">
                                        Master's Certificate
                                      </option>
                                    )}

                                    {/* experience + optional docs */}
                                    {isExperienced && (
                                      <>
                                        <option value="Offer Letter">
                                          Offer Letter
                                        </option>
                                        <option value="Relieving Letter">
                                          Relieving Letter
                                        </option>
                                        <option value="Experience Letter">
                                          Experience Letter
                                        </option>
                                      </>
                                    )}
                                    <option value="Passport">
                                      Passport (Optional)
                                    </option>
                                    <option value="Driving License">
                                      Driving License (Optional)
                                    </option>
                                    <option value="Other">Other</option>
                                  </Field>

                                  {touched.documents?.[i]?.type &&
                                    errors.documents?.[i]?.type && (
                                      <div className={errorCls}>
                                        {errors.documents[i].type}
                                      </div>
                                    )}
                                </div>

                                <div>
                                  <label className={labelCls}>
                                    Upload File{" "}
                                    <span className="text-red-400">*</span>
                                  </label>
                                  <input
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={async (e) => {
                                      const file = e.target.files[0];
                                      if (file) {
                                        const fileData = await toBase64(file);
                                        setFieldValue(
                                          `documents.${i}.file`,
                                          file
                                        );
                                        setFieldValue(
                                          `documents.${i}.fileData`,
                                          fileData
                                        );
                                        setFieldValue(
                                          `documents.${i}.name`,
                                          file.name
                                        );
                                      }
                                    }}
                                    className="text-sm text-gray-200 w-full file:mr-2 file:rounded-md file:bg-[#FFD700] file:text-black file:font-semibold
  md:text-gray-200 [@media(max-width:767px)]:text-transparent"
                                  />

                                  {doc.file && (
                                    <p
                                      className="text-xs text-gray-400 mt-1 truncate max-w-[230px]"
                                      title={doc.file.name}
                                    >
                                      Selected: {doc.file.name}
                                    </p>
                                  )}
                                  {touched.documents?.[i]?.file &&
                                    errors.documents?.[i]?.file && (
                                      <div className={errorCls}>
                                        {errors.documents[i].file}
                                      </div>
                                    )}
                                </div>

                                {values.documents.length > 1 && (
                                  <button
                                    type="button"
                                    className="text-red-400 text-sm hover:text-red-300"
                                    onClick={() => arrayHelpers.remove(i)}
                                  >
                                    ✕ Remove Document
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}

                          <button
                            type="button"
                            className="mt-2 text-[#FFD700] hover:text-[#FFC800] font-medium"
                            onClick={() =>
                              arrayHelpers.push({ type: "", file: null })
                            }
                          >
                            + Add Another Document
                          </button>

                          {typeof errors.documents === "string" && (
                            <div className={`${errorCls} mt-3`}>
                              {errors.documents}
                            </div>
                          )}
                        </div>
                      )}
                    />

                    <div className="flex flex-col sm:flex-row justify-between gap-3 pt-6">
                      <button
                        type="button"
                        onClick={goBack}
                        className="w-full sm:w-auto px-6 sm:px-8 py-3 border border-[#FFD700]/40 text-gray-300 rounded-lg hover:border-[#FFD700] transition"
                      >
                        ← Back
                      </button>

                      <button
                        type="button"
                        onClick={goNext}
                        disabled={isSubmittingStep}
                        className={`w-full sm:w-auto px-6 sm:px-8 py-3 bg-[#FFD700] text-black font-bold rounded-lg transition ${
                          isSubmittingStep
                            ? "opacity-60 cursor-not-allowed"
                            : "hover:bg-[#FFC800]"
                        }`}
                      >
                        {isSubmittingStep ? "Saving..." : "Continue →"}
                      </button>
                    </div>
                  </div>
                )}

{/* STEP 10: Password */}
{((step === 9 && !isExperienced) || (step === 10 && isExperienced)) && (
  <div className={`${cardBase} ${activeCard}`}>
    <h3 className="text-lg sm:text-xl font-bold mb-2 text-[#FFD700]">
      Set Your Password
    </h3>

    {/* 🟡 Notes section (moved to top) */}
    <p className="text-[12px] text-gray-400 mb-5 leading-relaxed">
      <span className="text-[#FFD700] font-semibold">Note:</span> <br /> 
      1. Your{" "}
      <span className="text-white/80 font-medium">temporary password</span> is
      provided in your onboarding email. <br />
      2. <span className="text-white/80 font-semibold"> Password must contain</span>{" "}
      an uppercase letter, lowercase letter, number, and special character.
    </p>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
      {/* Temporary Password */}
      <div className="relative ">
        <label className={labelCls}>
          Temporary Password <span className="text-red-400">*</span>
        </label>
        <div className="flex items-center">
        <Field
          type={showTemp ? "text" : "password"}
          name="temporaryPassword"
          placeholder="From your email"
          className={inputCls}
        />
        {/* 👁 Toggle Eye */}
        <button
          type="button"
          onClick={() => setShowTemp((p) => !p)}
          className="absolute right-3 text-gray-400 hover:text-[#FFD700] transition"
        >
          {showTemp ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
        </div>
        <ErrorMessage name="temporaryPassword" formik={formik} />
      </div>

      {/* New Password */}
      <div className="relative">
        <label className={labelCls}>
          New Password <span className="text-red-400">*</span>
        </label>
        <div className="flex items-center">
        <Field
          type={showNew ? "text" : "password"}
          name="newPassword"
          placeholder="Min 6 characters"
          className={inputCls}
        />
        {/* 👁 Toggle Eye */}
        <button
          type="button"
          onClick={() => setShowNew((p) => !p)}
          className="absolute right-3 text-gray-400 hover:text-[#FFD700] transition"
        >
          {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
        </div>
        <ErrorMessage name="newPassword" formik={formik} />
      </div>
    </div>

    <div className="flex flex-col sm:flex-row justify-between gap-3 pt-6">
      <button
        type="button"
        onClick={goBack}
        className="w-full sm:w-auto px-6 sm:px-8 py-3 border border-[#FFD700]/40 text-gray-300 rounded-lg hover:border-[#FFD700] transition"
      >
        ← Back
      </button>
      <button
        type="button"
        onClick={async () => {
          if (isSubmittingStep || isLoading) return;
          setIsSubmittingStep(true);

          const valid = await formik.validateForm();
          if (Object.keys(valid).length) {
            toast.error("Please fill all required fields correctly.");
            setIsSubmittingStep(false);
            return;
          }

          await handleSubmitStep(values);
          setIsSubmittingStep(false);
        }}
        disabled={isSubmittingStep || isLoading}
        className={`px-10 py-3 bg-[#FFD700] text-black font-bold rounded-lg transition ${
          isSubmittingStep || isLoading
            ? "opacity-60 cursor-not-allowed"
            : "hover:bg-[#FFC800]"
        }`}
      >
        {isSubmittingStep || isLoading
          ? "Submitting..."
          : "Complete Onboarding"}
      </button>
    </div>
  </div>
)}


              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
}
