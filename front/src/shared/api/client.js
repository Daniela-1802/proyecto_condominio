// src/shared/api/client.js
const BASE = process.env.REACT_APP_API_URL?.replace(/\/+$/, "") || "http://127.0.0.1:8000/api";

async function request(path, { method = "GET", body, headers } = {}) {
  const access = localStorage.getItem("access");
  const resp = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(access ? { Authorization: `Bearer ${access}` } : {}),
      ...(headers || {}),
    },
    ...(body != null ? { body: JSON.stringify(body) } : {}),
  });

  if (resp.status === 204) return null;

  let data = null;
  try { data = await resp.json(); } catch {}
  if (!resp.ok) {
    const msg = (data && (data.detail || data.message)) || `HTTP ${resp.status}`;
    throw new Error(msg);
  }
  return data;
}

export const api = {
  get: (url) => request(url),
  post: (url, body) => request(url, { method: "POST", body }),
  patch: (url, body) => request(url, { method: "PATCH", body }),
  put: (url, body) => request(url, { method: "PUT", body }),
  del: (url) => request(url, { method: "DELETE" }),
};
