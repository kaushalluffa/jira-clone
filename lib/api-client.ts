"use client";

import { useSession } from "./auth-client";
class ApiError extends Error {
  status: number;
  info: any;
  constructor(message: string, status: number, info: any) {
    super(message);
    this.status = status;
    this.info = info;
  }
}

export function useApiClient() {
  const { data: session } = useSession();

  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`;

    const token = session?.session?.token;

    const config: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      credentials: "include",
      
    };
    if (options.body && typeof options.body === "object") {
      config.body = JSON.stringify(options.body);
    }
    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      if (response.status === 401) {
        throw new ApiError(error.error || "Unauthorized", 401, error);
      }

      throw new ApiError(
        error.error || `API request failed: ${response.status}`,
        response.status,
        error
      );
    }
    return response.json();
  };
  return {
    get: (endpoint: string, options: RequestInit = {}) =>
      apiCall(endpoint, { ...options, method: "GET" }),
    post: (endpoint: string, body: any, options: RequestInit = {}) =>
      apiCall(endpoint, { ...options, method: "POST", body }),
    put: (endpoint: string, body: any, options: RequestInit = {}) =>
      apiCall(endpoint, { ...options, method: "PUT", body }),
    delete: (endpoint: string, options: RequestInit = {}) =>
      apiCall(endpoint, { ...options, method: "DELETE" }),
  };
}
