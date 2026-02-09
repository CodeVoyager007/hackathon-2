import { authClient } from "./auth-client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const API_PREFIX = "/api";

export const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  const session = await authClient.getSession();
  const token = session.data?.session.token;

  if (!token) {
    console.warn("No token found in session");
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${API_PREFIX}${cleanEndpoint}`;
  console.log(`Fetching: ${url}`);

  const res = await fetch(url, {
    ...options,
    headers,
  }).catch(err => {
    console.error(`Network Error when fetching ${url}:`, err);
    throw new Error(`Unable to connect to backend at ${url}`);
  });

  if (res.status === 401 || res.status === 403) {
      console.error("Unauthorized request to", endpoint);
  }

  return res;
};

const getUserId = async () => {
    const session = await authClient.getSession();
    const userId = session.data?.user.id;
    if (!userId) throw new Error("User ID not found in session");
    return userId;
};

export interface Task {
  id: string;
  title: str;
  description?: string;
  priority: "low" | "medium" | "high";
  due_date?: string;
  completed: boolean;
  tags: string[];
  recurrence?: {
    pattern: "none" | "daily" | "weekly" | "monthly" | "yearly";
    interval: number;
  };
  created_at: string;
  updated_at: string;
}

// Define a specific type for query parameters
interface TaskQueryParams {
    search?: string;
    sort_by?: 'created_at_desc' | 'due_date_asc' | 'priority_desc' | 'title_asc';
    status?: 'all' | 'pending' | 'completed';
    tag?: string;
    priority?: "low" | "medium" | "high";
}


export const getTasks = async (params: TaskQueryParams = {}): Promise<Task[]> => {
  const userId = await getUserId();
  const filteredParams = Object.fromEntries(Object.entries(params).filter(([_, v]) => v != null));
  const query = new URLSearchParams(filteredParams).toString();
  const endpoint = query ? `/users/${userId}/tasks?${query}` : `/users/${userId}/tasks`;
  const res = await fetchWithAuth(endpoint);
  if (!res.ok) return [];
  return res.json();
};

export const createTask = async (data: Partial<Task>): Promise<Task> => {
  const userId = await getUserId();
  const res = await fetchWithAuth(`/users/${userId}/tasks`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create task");
  return res.json();
};

export const updateTask = async (id: string, updates: Partial<Task>): Promise<Task> => {
  const userId = await getUserId();
  const res = await fetchWithAuth(`/users/${userId}/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update task");
  return res.json();
};

export const toggleTaskComplete = async (id: string): Promise<Task> => {
    const userId = await getUserId();
    const res = await fetchWithAuth(`/users/${userId}/tasks/${id}/complete`, {
      method: "PATCH",
    });
    if (!res.ok) throw new Error("Failed to toggle task");
    return res.json();
};

export const deleteTask = async (id: string): Promise<void> => {
  const userId = await getUserId();
  const res = await fetchWithAuth(`/users/${userId}/tasks/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete task");
};

export const getUserProfile = async (): Promise<{ id: string; email: string }> => {
  const res = await fetchWithAuth("/auth/me");
  if (!res.ok) throw new Error("Failed to fetch profile");
  return res.json();
};

export const getUserStats = async (): Promise<{ total_tasks: number; completed_tasks: number; pending_tasks: number }> => {
  const userId = await getUserId();
  const res = await fetchWithAuth(`/auth/${userId}/stats`);
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
};
