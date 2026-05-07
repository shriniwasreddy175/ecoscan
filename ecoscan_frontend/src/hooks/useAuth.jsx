import React, { createContext, useContext, useEffect, useState } from "react";
import { loginApi, signupApi, fetchProfileApi, updateProfileApi } from "../api/authApi";
import { storeToken, clearToken, getToken } from "../api/apiClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("ecoscan_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => getToken());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem("ecoscan_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("ecoscan_user");
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await loginApi({ email, password });
      // Store JWT token for authenticated API requests
      storeToken(res.token);
      setToken(res.token);
      setUser(res.user);
      setLoading(false);
      return res;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const signup = async (signupPayload) => {
    setLoading(true);
    try {
      await signupApi(signupPayload);
      // auto-login after signup to get the JWT token
      const res = await loginApi({ email: signupPayload.email, password: signupPayload.password });
      storeToken(res.token);
      setToken(res.token);
      setUser(res.user);
      setLoading(false);
      return res;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const logout = () => {
    clearToken();
    setToken(null);
    setUser(null);
  };

  const refreshProfile = async () => {
    if (!user?.email) return null;
    try {
      const profile = await fetchProfileApi(user.email);
      setUser(profile);
      return profile;
    } catch (err) {
      throw err;
    }
  };

  const updateProfile = async (profilePayload) => {
    if (!user?.email) throw new Error("No logged-in user");
    const updated = await updateProfileApi(user.email, profilePayload);
    setUser(updated);
    return updated;
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout, refreshProfile, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}