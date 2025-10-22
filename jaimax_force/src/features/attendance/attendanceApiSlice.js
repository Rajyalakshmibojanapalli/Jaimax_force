import { apiSlice } from "../../app/api/apiSlice";

export const attendanceApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // check-in
    checkIn: builder.mutation({
      query: ({ latitude, longitude }) => ({
        url: "/jaimaxforceattendance/check-in",
        method: "POST",
        body: { latitude, longitude },
        headers: { "Content-Type": "application/json" },
      }),
    }),
    checkOut: builder.mutation({
      query: ({ latitude, longitude }) => ({
        url: "/jaimaxforceattendance/check-out",
        method: "POST",
        body: { latitude, longitude },
        headers: { "Content-Type": "application/json" },
      }),
    }),

    getUserAttendance: builder.query({
      query: ({ userId, status, startDate, endDate, page = 1, limit = 10 }) => {
        let url = `/jaimaxforceattendance/userattendance/${userId}?page=${page}&limit=${limit}`;

        if (status) url += `&status=${status}`;
        if (startDate) url += `&startDate=${startDate}`;
        if (endDate) url += `&endDate=${endDate}`;

        return {
          url,
          method: "GET",
          headers: { "Content-Type": "application/json" },
        };
      },
      providesTags: ["Attendance"],
    }),

    getAllAttendance: builder.query({
        query: ({startDate, endDate, employeeId, sortBy, sortOrder, status}) =>{
            const today = new Date().toISOString().split("T")[0];
            const from = startDate || today;
            const to = endDate || today;

            let url = `/jaimaxforceattendance/getallattendance?startDate=${from}&endDate=${to}`;

            if(employeeId) url += `&employeeId=${employeeId}`;
            if(sortBy) url += `&sortBy=${sortBy}`;
            if(sortOrder) url += `&sortOrder=${sortOrder}`;
            if(status) url += `&status=${status}`;

            return{
                url,
                method: "GET",
                headers: { "Content-Type": "application/json" },
            };     
        },
        providesTags: ["AllAttendance"],
    }),

    getMonthlyAttendanceStats: builder.query({
        query: ({userId, month, year}) => {
            const now = new Date();
             // Default to current month and year if not provided
    const currentMonth = now.getMonth() + 1; // JS months are 0-based
    const currentYear = now.getFullYear();

    const selectedMonth = month || currentMonth;
    const selectedYear = year || currentYear;

    return {
      url: `/jaimaxforceattendance/stats/${userId}/monthly?month=${selectedMonth}&year=${selectedYear}`,
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
  },
  providesTags: ["AttendanceStats"],
}),
// /jaimaxforceattendance/stats/all/allmonthly?month=10&year=2025
 getAllUsersMonthlyAttendance: builder.query({
  query: ({userId, month, year}) => {
    const now = new Date();

    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    userId = userId || "all";
    const selectedMonth = month || currentMonth;
    const selectedYear = year || currentYear;

    return {
      url: `/jaimaxforceattendance/stats/${userId}/allmonthly?month=${selectedMonth}&year=${selectedYear}`,
      method:"GET",
      headers: { "Content-Type": "application/json" },
    };
  },
  providesTags: ["AttendanceStats"],
 }),
  }),
});

export const {
  useCheckInMutation,
  useCheckOutMutation,
  useGetUserAttendanceQuery,
  useGetAllAttendanceQuery,
  useGetMonthlyAttendanceStatsQuery,
  useGetAllUsersMonthlyAttendanceQuery,
} = attendanceApi;
