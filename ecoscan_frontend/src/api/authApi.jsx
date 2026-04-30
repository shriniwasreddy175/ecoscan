const AUTH_BASE = "http://localhost:8181/ecoscan/api/auth";
const USERS_BASE = "http://localhost:8181/ecoscan/api/users";

export async function signupApi(payload) {
  const res = await fetch(`${AUTH_BASE}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Signup failed");
  }
  return res.json();
}

export async function loginApi(payload) {
  const res = await fetch(`${AUTH_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Login failed");
  }
  return res.json();
}

export async function fetchProfileApi(email) {
  const res = await fetch(`${USERS_BASE}/me?email=${encodeURIComponent(email)}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to fetch profile");
  }
  return res.json();
}

export async function updateProfileApi(email, profile) {
  const res = await fetch(`${USERS_BASE}/me?email=${encodeURIComponent(email)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to update profile");
  }
  return res.json();
}