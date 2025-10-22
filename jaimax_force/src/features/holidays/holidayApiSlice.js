import { apiSlice } from "../../app/api/apiSlice";

export const holidaysApi = apiSlice.injectEndpoints({
    endpoints: (builder) =>({
        // get all holidays list
        getHolidays: builder.query({
            query:(year)=>{
                const now = new Date();
                const selectedYear = now.getFullYear();
                year = year || selectedYear;

                return{
                url: `/jaimaxforceholidays/holidays?year=${year}`,
                method:"GET",
                headers: {"Content-Type": "application/json"}
                }
            },
            providesTags: ["holidays"],
        }),
        // to add/create a holidays
        createHoliday: builder.mutation({
            query: ({body, year}) => {
                const now = new Date();
                const selectedYear = now.getFullYear();
                year = year || selectedYear;

                return {
                    url: `/jaimaxforceholidays/holidayscreate?year=${year}`,
                    method:"POST",
                    body,
                    headers: {"Content-Type": "application/json"}
                }
            },
            invalidatesTags:["holidays"],
        }),
        // delete a holidays
        deleteHoliday: builder.mutation({
            query: (id) => ({
                url: `/jaimaxforceholidays/holidays/${id}`,
                method:"DELETE",
                headers: {"Content-Type": "application/json"}
            }),
            invalidatesTags:["holidays"],
        })
    })
})

export const {
    useGetHolidaysQuery,
    useCreateHolidayMutation,
    useDeleteHolidayMutation,
} = holidaysApi