const DEFAULT_BASE_URL = "";

const getBaseUrl = () => {
  const envValue = import.meta.env.VITE_API_BASE_URL;
  if (typeof envValue === "string" && envValue.trim().length > 0) {
    return envValue.trim().replace(/\/$/, "");
  }

  return DEFAULT_BASE_URL;
};

let authTokenProvider: (() => string | null) | null = null;

const buildHeaders = (init?: RequestInit) => {
  const headers = new Headers({
    "Content-Type": "application/json",
  });

  if (init?.headers) {
    const provided = new Headers(init.headers);
    provided.forEach((value, key) => headers.set(key, value));
  }

  const token = authTokenProvider?.();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return headers;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}${path}`, {
    headers: buildHeaders(init),
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
  setAuthTokenProvider(provider: (() => string | null) | null) {
    authTokenProvider = provider;
  },
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
