import { createContext, useState, useEffect } from "react";
import { login, register, getMe, logout } from "./services/auth.api.jsx";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Start with loading: true

  // Check for existing authentication on app startup
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const me = await getMe();
        setUser(me.user);
      } catch {
        // Token is invalid or doesn't exist, user stays null
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = async (username, password) => {
    setLoading(true);

    try {
      await login(username, password);
      const me = await getMe();
      setUser(me.user);
      return me.user;
    } catch (err) {
      console.log(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (username, email, password) => {
    setLoading(true);
    try {
      await register(username, email, password);
      const me = await getMe();
      setUser(me.user);
      return me.user;
    } catch (err) {
      console.log(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
    } catch (err) {
      console.log(err);
      // Even if logout fails, clear user state
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, handleLogin, handleRegister, handleLogout, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
