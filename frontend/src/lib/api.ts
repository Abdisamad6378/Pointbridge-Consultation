import { errorMessage } from "@/lib/admin-api";

const API_BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

export type ContactPayload = {
  name: string;
  email: string;
  org?: string;
  subject: string;
  message: string;
};

export async function submitContact(data: ContactPayload) {
  const response = await fetch(`${API_BASE}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body ? errorMessage(body) : "Failed to send message");
  }

  return response.json() as Promise<{ ok: true; message: string }>;
}
