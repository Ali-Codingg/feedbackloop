import { useEffect, useState } from "react";
import { AuthContext } from "./authContextObject";
import { apiRequest } from "../api/apiClient";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("feedbackloop_token"));
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(Boolean(token));

  async function loadCurrentUser() {
    if (!token) {
      setUser(null);
      setLoadingUser(false);
      return;
    }

    try {
      const data = await apiRequest("/me");
      setUser(data.user);
    } catch {
      localStorage.removeItem("feedbackloop_token");
      setToken(null);
      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  }

  useEffect(() => {
    loadCurrentUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  function loginSession({ token, user }) {
    localStorage.setItem("feedbackloop_token", token);
    setToken(token);
    setUser(user);
  }

  function logout() {
    localStorage.removeItem("feedbackloop_token");
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: Boolean(token),
        isAdmin: user?.role === "ADMIN",
        loadingUser,
        loginSession,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}