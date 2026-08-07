// src/lib/api.js
// ---------------
// Thin fetch wrapper that attaches the Supabase Bearer token to every
// authenticated request. Import and use this instead of raw fetch for
// all calls to the FastAPI backend.
//
// Usage:
//   import { api } from "../lib/api";
//   const data = await api.get("/courses");
//   const data = await api.post("/progress/complete", { video_id: "..." });
//   const data = await api.delete("/admin/courses/123");
//   const data = await api.patch("/admin/users/123/role", { role: "admin" });

import { supabase } from "./supabaseClient";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
if (!BASE_URL) console.error("[Kahani] VITE_API_BASE_URL is not set!");

async function getAuthHeader() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session?.access_token) {
    return { Authorization: `Bearer ${session.access_token}` };
  }
  return {};
}

async function request(method, path, body) {
  const authHeader = await getAuthHeader();

  const options = {
    method,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...authHeader,
    },
  };

  if (body !== undefined) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${path}`, options);

  // 204 No Content — no body to parse
  if (response.status === 204) {
    return { ok: true, status: 204, data: null };
  }

  // Return {ok, status, data} so callers can handle non-2xx gracefully.
  let data;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  return { ok: response.ok, status: response.status, data };
}

export const api = {
  get:    (path)        => request("GET",    path),
  post:   (path, body)  => request("POST",   path, body),
  put:    (path, body)  => request("PUT",    path, body),
  patch:  (path, body)  => request("PATCH",  path, body),
  delete: (path)        => request("DELETE", path),
};
