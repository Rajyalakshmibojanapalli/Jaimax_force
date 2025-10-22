// src/features/profile/profileApiSlice.js
import { apiSlice } from "../../app/api/apiSlice";

export const profileApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => {
        return {
          url: "/jaimaxforceauth/profile",
          method: "GET",
        };
      },
      providesTags: ["Profile"],
    }),

    changePassword: builder.mutation({
    query: ({currentPassword, newPassword}) =>{
      return{
        url: "/jaimaxforceauth/change-password",
        method:"PUT",
        body: {currentPassword, newPassword},
        headers: {
            "Content-Type": "application/json",
          },
      }
    }
  })
  }),
});

export const { useGetProfileQuery, useChangePasswordMutation } = profileApiSlice;
