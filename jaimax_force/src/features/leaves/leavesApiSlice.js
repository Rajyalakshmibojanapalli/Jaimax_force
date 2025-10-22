import { apiSlice } from "../../app/api/apiSlice";

export const leavesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all leaves
    getAllLeaves: builder.query({
      query: () => ({
        url: "/jaimaxforceleaves/getallleaves",
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }),
      providesTags: ["Leaves"],
    }),
    // apply for a leave
    applyLeave: builder.mutation({
      query: (payload) => ({
        url: "/jaimaxforceleaves/leaveapply",
        method: "POST",
        body: payload,
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: ["Leaves"],
    }),
    // Get single leave by ID
    getSingleLeave: builder.query({
      query: (id) => ({
        url: `/jaimaxforceleaves/getsingleleave/${id}`,
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }),
      providesTags: ["SingleLeave"],
    }),
    // approve leave
    approveLeave: builder.mutation({
      query: ({ id, body }) => ({
        url: `/jaimaxforceleaves/${id}/approveleave`,
        method: "PUT",
        body,
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: ["Leaves"],
    }),
    // reject leave
    rejectLeave: builder.mutation({
      query: ({ id, body }) => ({
        url: `/jaimaxforceleaves/${id}/rejectleave`,
        method: "PUT",
        body,
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: ["Leaves"],
    }),
    // cancel a leavecancelLeave: builder.mutation({
    cancelLeave: builder.mutation({
      query: (id) => ({
        url: `/jaimaxforceleaves/${id}/leavecancel`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: ["Leaves"],
    }),
    // get the summary of leaves used
    getLeavesSummary: builder.query({
        query: (userId) => ({
            url: `/jaimaxforceleaves/summary/${userId}`,
            method: "GET",
            headers: { "Content-Type": "application/json" },
        }),
      invalidatesTags: ["Leaves"],  
    }),
    // to get the balanced leaves
    getBalancedLeaves: builder.query({
        query: (userId) =>({
            url:  `/jaimaxforceleaves/balanceleaves/${userId}`,
            method: "GET",
            headers: { "Content-Type": "application/json" },
        }),
      invalidatesTags: ["Leaves"],  
    })
  }),
});

export const {
  useGetAllLeavesQuery,
  useApplyLeaveMutation,
  useGetSingleLeaveQuery,
  useApproveLeaveMutation,
  useRejectLeaveMutation,
  useCancelLeaveMutation,
  useGetLeavesSummaryQuery,
  useGetBalancedLeavesQuery,
} = leavesApi;
