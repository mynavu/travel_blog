// src/hooks/useAuth.ts
import { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { path } from "./App";

export function useAuth() {
  const [cookies, , removeCookie] = useCookies(["token", "userId"]);

  const [user, setUser] = useState<null | {
    userId: number;
    email?: string;
  }>(null);

  const [loading, setLoading] = useState(true);

  const token = cookies.token;
  const userId = cookies.userId;

  useEffect(() => {
    const check = async () => {
      setLoading(true);

      if (!token || !userId) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${path}/users/${userId}`, {
          headers: {
            "X-Authorization": token,
          },
        });

        // IMPORTANT: only logged in if backend accepts token
        setUser({
          userId,
          email: res.data.email,
        });
      } catch (err) {
        setUser(null);
        removeCookie("token");
        removeCookie("userId");
      } finally {
        setLoading(false);
      }
    };

    check();
  }, [token, userId]);

  return {
    user,
    loading,
    isLoggedIn: !!user?.email,
    token,
    userId,
  };
}
