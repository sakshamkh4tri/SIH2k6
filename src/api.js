// In production the API is served by the same Vercel deployment.  Keeping the
// development fallback avoids changing the existing `npm run dev` workflow.
export const API_URL = (import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:4000/api" : "/api")).replace(/\/$/, "");
const TOKEN_KEY = "projectpulse_token";
const USER_KEY = "projectpulse_user";

async function request(path, options = {}) {
  const token = sessionStorage.getItem(TOKEN_KEY);
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const body = response.status === 204 ? null : await response.json();
  if (!response.ok) {
    if (response.status === 401) logout();
    throw new Error(body?.message || "The request could not be completed.");
  }
  return body;
}

export async function login(email, password) {
  const result = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  sessionStorage.setItem(TOKEN_KEY, result.token);
  sessionStorage.setItem(USER_KEY, JSON.stringify(result.user));
  return result;
}

export function logout() {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
}

export function isAuthenticated() {
  return Boolean(sessionStorage.getItem(TOKEN_KEY));
}

export function currentUser() {
  try {
    return JSON.parse(sessionStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
}

export const getDashboard = () => request("/dashboard");
export const getProjects = (query = "") => request(`/projects${query ? `?q=${encodeURIComponent(query)}` : ""}`);
export const getProject = (id) => request(`/projects/${id}`);
export const addProgress = (id, data) => request(`/projects/${id}/progress`, { method: "POST", body: JSON.stringify(data) });
export const addIssue = (id, data) => request(`/projects/${id}/issues`, { method: "POST", body: JSON.stringify(data) });
export const addMilestone = (id, data) => request(`/projects/${id}/milestones`, { method: "POST", body: JSON.stringify(data) });
export const reportUrl = (id) => `${API_URL}/projects/${id}/report`;
export const getAlerts = () => request("/alerts");
export const resolveAlert = (id) => request(`/alerts/${id}/resolve`, { method: "PATCH" });
export const getRiskRadar = () => request("/risk-radar");
export const askAssistant = (message, conversationId) => request("/assistant/query", { method: "POST", body: JSON.stringify({ message, conversationId }) });
