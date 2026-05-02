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
      setCookie("token", result.data.token);
      setCookie("userId", result.data.userId);
      setIsLoggedIn(true);
      navigate("/search");
    } catch (e: any) {
      setErrorMessage(e.response?.statusText || "An error occurred");
      console.log(e.response);
    }
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p>Log In</p>
      <input
        className="bg-white"
        type="text"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="bg-white"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={() => logIn()}>Submit</button>
      <p>{errorMessage !== null && errorMessage}</p>
    </div>
  );
}
