const DEFAULT_BASE_URL = "http://localhost:5050";

const getBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "");
  }

  return DEFAULT_BASE_URL;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    ...init,
  });

  if (!response.ok) {
    const message = await response
      .json()
      .catch(() => ({ error: response.statusText }));

    throw new Error(message.error ?? "Request failed");
  }

  return response.json() as Promise<T>;
}

export const apiClient = {
  request,
  get<T>(path: string, init?: RequestInit) {
    return request<T>(path, { method: "GET", ...init });
  },
  post<T>(path: string, body?: unknown, init?: RequestInit) {
    return request<T>(path, {
      method: "POST",
      body: body !== undefined ? JSON.stringify(body) : undefined,
      ...init,
    });
  },
};
