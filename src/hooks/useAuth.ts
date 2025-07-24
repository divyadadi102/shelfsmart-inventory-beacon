import { useNavigate } from "react-router-dom";

// Main hook for auth-related actions
export const useAuth = () => {
  const navigate = useNavigate();

  const register = async (name: string, email: string, password: string, businessName: string) => {
    const response = await fetch("http://127.0.0.1:8000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, business_name: businessName }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.detail || "Registration failed");
    }
    return await response.json();
  };

  const login = async (email: string, password: string) => {
    const response = await fetch("http://127.0.0.1:8000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();
    localStorage.setItem("access_token", data.access_token);
    navigate("/dashboard");
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  return { register, login, logout };
};

// Separate function to fetch the currently logged-in user
export const fetchCurrentUser = async () => {
  const token = localStorage.getItem("access_token");

  const response = await fetch("http://127.0.0.1:8000/api/user/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user info");
  }

  return await response.json(); // { name, email, business_name }
};
