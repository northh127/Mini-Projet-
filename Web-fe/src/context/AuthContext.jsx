import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    // โหลด token และ user จาก localStorage ถ้ามี
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    return token && user ? { token, user: JSON.parse(user) } : null;
  });

  // ฟังก์ชัน login
  const login = ({ token, user }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setAuth({ token, user });
  };

  // ฟังก์ชัน logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuth(null);
  };

  useEffect(() => {
    // sync state กับ localStorage เวลา refresh
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token && user) {
      setAuth({ token, user: JSON.parse(user) });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
