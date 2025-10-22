// src/features/manager/onboardingApiSlice.js
import { apiSlice } from "../../app/api/apiSlice";

export const onboardingApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // --- Create User (Manager/Admin) ---
    createUser: builder.mutation({
      query: (payload) => ({
        url: "/jaimaxforceonboaring/create-user",
        method: "POST",
        body: payload,
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: ["Users"],
    }),

    // --- Verify User (Email link) ---
    verifyUser: builder.query({
      query: (token) => ({
        url: `/jaimaxforceonboaring/verify/${token}`,
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }),
      providesTags: ["Users"],
    }),

    // --- Complete Onboarding (Employee) ---
    completeOnboarding: builder.mutation({
      query: ({ token, payload }) => ({
        url: `/jaimaxforceonboaring/complete/${token}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Users"],
    }),

    // --- Update Rejected Section (Employee Resubmission) ---
    updateRejectedSection: builder.mutation({
      query: ({ employeeId, section, payload }) => ({
        url: `/jaimaxforceonboaring/update-rejected/${employeeId}/${section}`,
        method: "PUT",
        body: payload,
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: ["Profile"],
    }),

    // --- Get All Onboarded Employees (For Manager/Admin) ---
    getAllEmployees: builder.query({
  query: ({ searchTerm = "", page = 1, limit = 10 } = {}) => {

    return {
      url: `/jaimaxforceonboaring/employees?search=${searchTerm}&page=${page}&limit=${limit}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
    };
  },
  providesTags: ["Employees"],
}),


    // --- Get Single Employee By ID (Detailed View) ---
    getEmployeeById: builder.query({
      query: (employeeId) => ({
        url: `/jaimaxforceonboaring/employee/${employeeId}`,
        method: "GET",
      }),
      providesTags: ["Employee"],
    }),

    // --- Verify Section For an Employee ---
    verifyEmployeeSection: builder.mutation({
      query: ({ employeeId, section, payload }) => ({
        url: `/jaimaxforceonboaring/verify-all/${employeeId}/${section}`,
        method: "PATCH",
        body: payload,
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: ["Employee"],
    }),
    // --- Mark Onboarding as Completed (HR Final Step) ---
    completeEmployeeOnboarding: builder.mutation({
      query: (employeeId) => ({
        url: `/jaimaxforceonboaring/update-onboarding-status/${employeeId}/completed`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: ["Employee", "Employees"],
    }),

    resendInvitation: builder.mutation({
      query: (payload) => ({
        url: "/jaimaxforceonboaring/resend-invitation",
        method: "POST",
        body: payload,
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useCreateUserMutation,
  useVerifyUserQuery,
  useCompleteOnboardingMutation,
  useUpdateRejectedSectionMutation,
  useGetAllEmployeesQuery,
  useGetEmployeeByIdQuery,
  useVerifyEmployeeSectionMutation,
  useCompleteEmployeeOnboardingMutation,
  useResendInvitationMutation,
} = onboardingApi;
