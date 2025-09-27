const API = process.env.REACT_APP_API_URL; // <-- CRA usa process.env

export async function login(username, password) {
  const resp = await fetch(`${API}/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!resp.ok) throw new Error("login-failed");
  return resp.json(); // { access, refresh }
}

export async function refreshToken(refresh) {
  const resp = await fetch(`${API}/auth/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });
  if (!resp.ok) throw new Error("refresh-failed");
  return resp.json(); // { access }
}

export async function getMe(access) {
  const resp = await fetch(`${API}/me/`, {
    headers: { Authorization: `Bearer ${access}` },
  });
  if (!resp.ok) throw new Error("me-failed");
  return resp.json();
}
