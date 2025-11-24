import { useState, useEffect } from "react";
import axios from "axios";

interface User {
  id: number;
  name: string;
  email: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Verifica se existe login salvo
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    axios
      .get("http://localhost:8080/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Login
  const signIn = async (email: string, password: string) => {
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8080/auth/login", {
        email,
        password,
      });

      const token = res.data.token;
      localStorage.setItem("token", token);

      const profile = await axios.get("http://localhost:8080/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(profile.data);

      return { ok: true };
    } catch (err) {
      return { ok: false };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const signOut = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return {
    user,
    loading,
    signIn,
    signOut,
  };
}
