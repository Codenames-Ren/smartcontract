export const API_BASE_URL =
  (import.meta.env['VITE_API_BASE_URL'] as string | undefined) ?? "http://localhost:3000";

export const endpoints = {
  health: "/",
  register: "/documents/register",
  verify: "/documents/verify",
  detail: (hash: string) => `/documents/${hash}`,
  file: (hash: string) => `/documents/${hash}/file`,
  revoke: (hash: string) => `/documents/${hash}/revoke`,
};

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

async function parse<T>(res: Response): Promise<T> {
  const text = await res.text();
  let json: unknown;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    throw new ApiError(text || `Request failed (${res.status})`, res.status);
  }
  const body = json as { success?: boolean; data?: T; message?: string; error?: string };
  if (!res.ok || body.success === false) {
    throw new ApiError(body.message ?? body.error ?? `Request failed (${res.status})`, res.status);
  }
  return (body.data ?? (body as unknown)) as T;
}

export const apiClient = {
  url(path: string) {
    return `${API_BASE_URL}${path}`;
  },
  async get<T>(path: string): Promise<T> {
    const res = await fetch(this.url(path));
    return parse<T>(res);
  },
  async post<T>(path: string, body?: FormData): Promise<T> {
    const init: RequestInit = body ? { method: "POST", body } : { method: "POST" };
    const res = await fetch(this.url(path), init);
    return parse<T>(res);
  },
  async getBlob(path: string): Promise<Blob> {
    const res = await fetch(this.url(path));
    if (!res.ok) throw new ApiError(`File request failed (${res.status})`, res.status);
    return res.blob();
  },
};
