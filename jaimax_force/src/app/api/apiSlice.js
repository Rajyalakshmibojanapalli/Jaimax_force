// src/app/api/apiSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout, setCredentials } from "../../features/auth/authSlice";

// --- Base Query Configuration ---
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  prepareHeaders: (headers, { endpoint }) => {
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    );

    const token = localStorage.getItem("accessToken");

    // ✅ Only attach token if NOT calling the refresh-token endpoint
    if (token && !endpoint?.includes("refresh-token")) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

// --- Wrapper for token refresh + auto-logout ---
export const baseQueryWithReAuth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // 🔁 Handle access token expiry
  if (result?.error?.data?.status_code === 408 || result?.error?.status === 408) {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      console.warn("No refresh token found — forcing logout");
      localStorage.clear();
      window.location.href = "/login";
      return result;
    }

    // 🔁 Try to get a new access token
    const refreshResult = await fetchBaseQuery({
      baseUrl: import.meta.env.VITE_API_BASE_URL,
    })(
      {
        url: "/jaimaxforceauth/refresh-token",
        method: "POST",
        body: { refreshToken },
      },
      api,
      extraOptions
    );

    if (refreshResult?.data?.data?.accessToken) {
      const newAccessToken = refreshResult.data.data.accessToken;
      const newRefreshToken = refreshResult.data.data.refreshToken || refreshToken;

      // Save new tokens
      localStorage.setItem("accessToken", newAccessToken);
      localStorage.setItem("refreshToken", newRefreshToken);

      // Update Redux credentials
      const user = JSON.parse(localStorage.getItem("user"));
      api.dispatch(setCredentials({ user, accessToken: newAccessToken, refreshToken: newRefreshToken }));

      // Retry original request silently
      result = await baseQuery(args, api, extraOptions);
    } else {
      console.warn("Token refresh failed — forcing logout");
      api.dispatch(logout());
      window.location.href = "/login";
      return refreshResult;
    }
  }

  // 🚫 Handle 401 Unauthorized (fallback)
  const endpointUrl = typeof args === "string" ? args : args?.url || "";

  if (
    (result?.error?.data?.status_code === 401 || result?.error?.status === 401) &&
    !endpointUrl.includes("/jaimaxforceauth/login") &&
    !endpointUrl.includes("/jaimaxforceauth/forgot-password") &&
    !endpointUrl.includes("/jaimaxforceauth/reset-password") &&
    !endpointUrl.includes("/jaimaxforceauth/refresh-token")
  ) {
    console.warn("Unauthorized — clearing session");
    api.dispatch(logout());
    window.location.href = "/login";
  }

  return result;
};

// --- Export a single reusable API Slice ---
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReAuth,
  tagTypes: [
    "Auth",
    "Admin",
    "Manager",
    "Users",
    "Transactions",
    "Reports",
    "Settings",
    "Kyc",
  ],
  endpoints: () => ({}),
});

export const { usePrefetch } = apiSlice;
