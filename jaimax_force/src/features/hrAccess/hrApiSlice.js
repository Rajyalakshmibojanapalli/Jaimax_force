import { apiSlice } from "../../app/api/apiSlice";

export const hrApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Activate employee
    activateEmployee: builder.mutation({
      query: (employeeId) => ({
        url: `/jaimaxforceonboaring/${employeeId}/activate`,
        method: "POST",
      }),
      invalidatesTags: ["Employees"], 
    }),

    // Deactivate employee
    deactivateEmployee: builder.mutation({
      query: ({ employeeId, reason }) => ({
        url: `/jaimaxforceonboaring/${employeeId}/deactivate`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: ["Employees"],
    }),
    // Delete employee (soft or hard based on 'permanent' flag)
    // deleteEmployee: builder.mutation({
    //   query: ({ employeeId, permanent = false }) => ({
    //     url: `/jaimaxforceonboaring/employee-delete/${employeeId}?permanent=${permanent}`,
    //     method: "DELETE",
    //   }),
    //   invalidatesTags: ["Employees"],
    // }),
    deleteEmployee: builder.mutation({
      query: ({ employeeId, permanent, exitReason }) => {
        let url = `/jaimaxforceonboaring/employee-delete/${employeeId}`;
        const config = { method: "DELETE" };

        if (permanent) {
          // Hard delete — add query param, no body
          url += `?permanent=true`;
        } else {
          // Soft delete — include exitReason in body
          config.body = { exitReason };
        }

        return { url, ...config };
      },
      invalidatesTags: ["Employees"],
    }),

    updateEmployee: builder.mutation({
      query: ({employeeId, updateData}) =>({
        url:`/jaimaxforceonboaring/employee-update/${employeeId}`,
        method:"PUT",
        body: updateData
      }),
      invalidatesTags:["Employees"],
    })
  }),
});

export const {
  useActivateEmployeeMutation,
  useDeactivateEmployeeMutation,
  useDeleteEmployeeMutation,
  useUpdateEmployeeMutation,
} = hrApiSlice;
