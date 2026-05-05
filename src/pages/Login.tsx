// U11
import { use, useState } from "react";
import { path } from "../App";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import type { CookieSetOptions } from "universal-cookie";

type LoginProps = {
  setCookie: (
    name: "token" | "userId",
    value: any,
    options?: CookieSetOptions | undefined,
  ) => void;
  setIsLoggedIn: (value: boolean) => void;
};
export function Login({ setCookie, setIsLoggedIn }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<null | string>(null);

  const navigate = useNavigate();

  const logIn = async () => {
    if (email.length === 0 || password.length === 0) return;
    try {
      const result = await axios.post(`${path}/users/login`, {
        email,
        password,
      });
      setCookie("token", result.data.token, { path: "/", maxAge: 86400 });
      setCookie("userId", result.data.userId, { path: "/", maxAge: 86400 });
      setIsLoggedIn(true);
      navigate("/search");
    } catch (e: any) {
      setErrorMessage(e.response?.statusText || "An error occurred");
      console.log(e.response);
    }
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <div className="glass p-5 rounded-2xl flex flex-col gap-2 text-white text-sm items-center">
        <p>Log In</p>
        <div className="flex gap-2">
          <p>Email: </p>
          <input
            className="bg-white glass rounded-2xl"
            type="text"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <p>Password: </p>
          <input
            className="bg-white glass rounded-2xl"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="glass px-2 rounded-2xl" onClick={() => logIn()}>
          Submit
        </button>
        <p>{errorMessage !== null && errorMessage}</p>
      </div>
    </div>
  );
}
