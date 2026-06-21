import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const saveUser = (userData) => {
    // Role aur ID ko preserve karein
    const normalizedUser = { 
      ...userData, 
      role: userData.role.toLowerCase(),
      // Agar teacherId nahi hai, to null ya original ID use karein
      id: userData.teacherId || userData.id 
    };
    setUser(normalizedUser);
    localStorage.setItem("user", JSON.stringify(normalizedUser));
    localStorage.setItem("role", normalizedUser.role);
    localStorage.setItem("userName", normalizedUser.name);
  };

  const logout = () => {
    setUser(null);
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, saveUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}