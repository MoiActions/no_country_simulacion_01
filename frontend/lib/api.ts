const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3008";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** Fallo de red / backend apagado (no respuesta HTTP). */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof TypeError && error.message === "Failed to fetch") {
    return true;
  }
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string" &&
    ((error as { message: string }).message.includes("Failed to fetch") ||
      (error as { message: string }).message.includes("NetworkError"))
  );
}

export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Error de API" }));
    throw new ApiError(res.status, error.message || "Error de API");
  }

  return res.json();
}

export const api = {
  get: <T>(endpoint: string) => apiClient<T>(endpoint),
  post: <T>(endpoint: string, data: unknown) =>
    apiClient<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  patch: <T>(endpoint: string, data: unknown) =>
    apiClient<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  put: <T>(endpoint: string, data: unknown) =>
    apiClient<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: <T>(endpoint: string) =>
    apiClient<T>(endpoint, {
      method: "DELETE",
    }),
};
