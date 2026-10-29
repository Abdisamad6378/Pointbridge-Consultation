const API_BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");
export const TOKEN_KEY = "pb_token";

export type UserRole = "admin" | "user";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  organization: string;
  role: UserRole;
  createdAt: string;
  /** API-relative path such as /api/users/1/avatar?v=…; resolve with assetUrl(). */
  avatarUrl: string | null;
};

/** Resolves an API-relative path (e.g. an avatar URL) against the configured API origin. */
export function assetUrl(path: string) {
  return `${API_BASE}${path}`;
}

// Storage can throw (private mode, blocked site data); treat that as "signed out".
export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Session then lasts only for this page load.
  }
}

// NestJS exceptions send { statusCode, message, error }, where `error` is only the
// HTTP status name (e.g. "Conflict") and `message` is the readable text, or a list
// of messages when validation fails.
type ApiErrorBody = { message?: string | string[]; error?: string };

export function errorMessage(body: ApiErrorBody | null) {
  const message = Array.isArray(body?.message) ? body.message.join(", ") : body?.message;
  return message || body?.error || "Request failed";
}

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      // FormData bodies must let the browser set the multipart boundary itself.
      ...(init?.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  });

  const body = (await response.json().catch(() => null)) as ApiErrorBody | T | null;

  if (!response.ok) {
    throw new Error(errorMessage(body as ApiErrorBody | null));
  }

  return body as T;
}

export async function loginRequest(email: string, password: string) {
  return api<{ ok: true; token: string; user: AuthUser }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function signupRequest(data: {
  name: string;
  email: string;
  password: string;
  organization?: string;
}) {
  return api<{ ok: true; token: string; user: AuthUser }>("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function fetchMe() {
  return api<{ user: AuthUser }>("/api/auth/me");
}

export async function updateProfileRequest(data: { name?: string; organization?: string }) {
  return api<{ user: AuthUser }>("/api/profile", { method: "PATCH", body: JSON.stringify(data) });
}

export async function changePasswordRequest(data: { currentPassword: string; newPassword: string }) {
  return api<{ ok: true }>("/api/profile/password", { method: "POST", body: JSON.stringify(data) });
}

export async function uploadAvatarRequest(image: Blob) {
  const body = new FormData();
  body.append("avatar", image, "avatar");
  return api<{ user: AuthUser }>("/api/profile/avatar", { method: "PUT", body });
}

export async function removeAvatarRequest() {
  return api<{ user: AuthUser }>("/api/profile/avatar", { method: "DELETE" });
}

export type AdminStats = {
  contacts: { total: number; new: number };
  testimonials: { total: number; pending: number };
  images: { total: number };
  users: { total: number };
  team: { total: number };
  clients: { total: number };
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  org: string | null;
  subject: string;
  message: string;
  status: "new" | "read" | "replied";
  createdAt: string;
};

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  quote: string;
  image: string | null;
  approved: boolean;
  createdAt: string;
};

export type SiteImage = {
  id: string;
  key: string;
  label: string;
  url: string;
  category: string;
  updatedAt: string;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type ClientLogo = {
  id: string;
  name: string;
  logo: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type AdminUser = AuthUser;

export const adminApi = {
  stats: () => api<AdminStats>("/api/admin/stats"),
  contacts: () => api<{ items: ContactMessage[] }>("/api/admin/contacts"),
  updateContact: (id: string, status: ContactMessage["status"]) =>
    api<{ item: ContactMessage }>(`/api/admin/contacts/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  deleteContact: (id: string) =>
    api<{ ok: true }>(`/api/admin/contacts/${id}`, { method: "DELETE" }),
  testimonials: () => api<{ items: Testimonial[] }>("/api/admin/testimonials"),
  createTestimonial: (data: Pick<Testimonial, "name" | "role" | "quote" | "approved" | "image">) =>
    api<{ item: Testimonial }>("/api/admin/testimonials", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateTestimonial: (id: string, data: Partial<Pick<Testimonial, "name" | "role" | "quote" | "approved" | "image">>) =>
    api<{ item: Testimonial }>(`/api/admin/testimonials/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  deleteTestimonial: (id: string) =>
    api<{ ok: true }>(`/api/admin/testimonials/${id}`, { method: "DELETE" }),
  images: () => api<{ items: SiteImage[] }>("/api/admin/images"),
  createImage: (data: Pick<SiteImage, "key" | "label" | "url" | "category">) =>
    api<{ item: SiteImage }>("/api/admin/images", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateImage: (id: string, data: Partial<Pick<SiteImage, "key" | "label" | "url" | "category">>) =>
    api<{ item: SiteImage }>(`/api/admin/images/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  deleteImage: (id: string) =>
    api<{ ok: true }>(`/api/admin/images/${id}`, { method: "DELETE" }),
  team: () => api<{ items: TeamMember[] }>("/api/admin/team"),
  createTeamMember: (data: Pick<TeamMember, "name" | "role" | "bio" | "image" | "sortOrder">) =>
    api<{ item: TeamMember }>("/api/admin/team", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateTeamMember: (
    id: string,
    data: Partial<Pick<TeamMember, "name" | "role" | "bio" | "image" | "sortOrder">>,
  ) =>
    api<{ item: TeamMember }>(`/api/admin/team/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  deleteTeamMember: (id: string) =>
    api<{ ok: true }>(`/api/admin/team/${id}`, { method: "DELETE" }),
  clients: () => api<{ items: ClientLogo[] }>("/api/admin/clients"),
  createClient: (data: Pick<ClientLogo, "name" | "logo" | "sortOrder">) =>
    api<{ item: ClientLogo }>("/api/admin/clients", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateClient: (id: string, data: Partial<Pick<ClientLogo, "name" | "logo" | "sortOrder">>) =>
    api<{ item: ClientLogo }>(`/api/admin/clients/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  deleteClient: (id: string) =>
    api<{ ok: true }>(`/api/admin/clients/${id}`, { method: "DELETE" }),
  users: () => api<{ items: AdminUser[] }>("/api/admin/users"),
  createUser: (data: { name: string; email: string; password: string; organization?: string; role: UserRole }) =>
    api<{ item: AdminUser }>("/api/admin/users", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateUser: (id: string, data: Partial<{ name: string; organization: string; role: UserRole; password: string }>) =>
    api<{ item: AdminUser }>(`/api/admin/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  deleteUser: (id: string) =>
    api<{ ok: true }>(`/api/admin/users/${id}`, { method: "DELETE" }),
};

export async function fetchPublicImages() {
  return api<{ items: SiteImage[]; map: Record<string, string> }>("/api/content/images");
}

export async function fetchPublicTestimonials() {
  return api<{ items: Testimonial[] }>("/api/content/testimonials");
}

export async function fetchPublicTeamMembers() {
  return api<{ items: TeamMember[] }>("/api/content/team");
}

export async function fetchPublicClients() {
  return api<{ items: ClientLogo[] }>("/api/content/clients");
}

export async function submitFeedback(data: { name: string; role: string; quote: string }) {
  return api<{ ok: true; message: string }>("/api/content/feedback", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
