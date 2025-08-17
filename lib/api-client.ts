"use client";

import { useAuth } from "@workos-inc/authkit-nextjs/components";

export function useApiClient() {
  const { sessionId } = useAuth();

  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    if (!sessionId) {
      throw new Error("No session available");
    }

    const url = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`;

    const config = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "X-WorkOS-Session-ID": sessionId,
        ...options.headers,
      },
    };

    if (options.body && typeof options.body === "object") {
      config.body = JSON.stringify(options.body);
    }

    const response = await fetch(url, config);

    if (!response.ok) {
      if (response.status === 401) {
        // Session is invalid, redirect to login
        window.location.href = "/login";
        return;
      }
      throw new Error(`API request failed: ${response.status}`);
    }

    return response.json();
  };

  return {
    get: (endpoint: string, options: RequestInit = {}) =>
      apiCall(endpoint, { ...options, method: "GET" }),
    post: (endpoint: string, data: any, options: RequestInit = {}) =>
      apiCall(endpoint, { ...options, method: "POST", body: data }),
    put: (endpoint: string, data: any, options: RequestInit = {}) =>
      apiCall(endpoint, { ...options, method: "PUT", body: data }),
    delete: (endpoint: string, options: RequestInit = {}) =>
      apiCall(endpoint, { ...options, method: "DELETE" }),
  };
}
