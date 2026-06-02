const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

export const apiRequest = async (path, options = {}) => {
  const token = localStorage.getItem("ett_token");

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    },
    ...options
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed." }));
    throw new Error(error.message || "Request failed.");
  }

  return response.json();
};
