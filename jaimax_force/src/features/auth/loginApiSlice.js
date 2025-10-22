import { apiSlice } from "../../app/api/apiSlice";
import { logout } from "./authSlice";

export const loginApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // --- LOGIN ---
    login: builder.mutation({
      query: (credentials) => ({
        url: "/jaimaxforceauth/login",
        method: "POST",
        body: credentials,
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: ["Auth"],
    }),

    // --- LOGOUT ---
    logoutUser: builder.mutation({
      query: () => {
        const accessToken = localStorage.getItem("accessToken");
        return {
          url: "/jaimaxforceauth/logout",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`, // send token in header
          },
        };
      },
      // async onQueryStarted(arg, { dispatch, queryFulfilled }) {
      //   try {
      //     await queryFulfilled;
      //   } catch (err) {
      //     console.error("Logout error:", err);
      //   } finally {
      //     // Just clear Redux + storage, no redirect here
      //     dispatch(logout());
      //     // localStorage.clear();
      //   }
      // },
      invalidatesTags: ["Auth"],
    }),
    // --- FORGOT PASSWORD ---
    forgotPassword: builder.mutation({
      query: (email) => {
        // const accessToken = localStorage.getItem("accessToken");
        return {
          url:"/jaimaxforceauth/forgot-password",
          method: "POST",
          body: { email },
          headers:{"Content-Type": "application/json"}
        }
      },
      invalidatesTags: ["Auth"],
    }),

    // --- RESET PASSWORD ---
    resetPassword: builder.mutation({
  query: ({ token, newPassword, confirmPassword }) => {
    // Fetch token if not provided explicitly
    // const token = "10931b238308484129828f438281bbc8143cf6adec459f37771c0a9a0aeab39d"

    return {
      url: `/jaimaxforceauth/reset-password/${token}`,
      method: "POST",
      body: { newPassword, confirmPassword },
      headers: { "Content-Type": "application/json" },
    };
  },
  invalidatesTags: ["Auth"],
}),
  }),
});

export const { useLoginMutation, useLogoutUserMutation,  useForgotPasswordMutation, useResetPasswordMutation, } = loginApi;
