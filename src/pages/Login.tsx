// U11
import { use, useState } from "react";
import { path } from "../App";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import type { CookieSetOptions } from "universal-cookie";
import { Eye, EyeClosed } from "lucide-react";

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
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const logIn = async () => {
    let allErrors = "";

    if (email.length === 0 || password.length === 0) {
      allErrors += "Please fill in all the required info.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      allErrors += " Email is invalid.";
    }

    if (allErrors.length > 0) {
      setErrorMessage(allErrors.trimStart());
      return;
    }

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
      <div className="glass p-10 w-100 rounded-2xl flex flex-col gap-2 text-white text-sm items-center">
        <p className="text-xl pb-3">Log In</p>
        <div className="flex gap-2 w-full">
          <p>
            Email<span className="text-rose-400">*</span>{" "}
          </p>
          <input
            className="bg-white glass rounded-2xl flex-1"
            type="text"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full">
          <p>
            Password<span className="text-rose-400">*</span>{" "}
          </p>
          <input
            className="bg-white glass rounded-2xl flex-1"
            type={showPassword ? "text" : "password"}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="glass rounded-2xl p-0.5 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <Eye size={20} /> : <EyeClosed size={20} />}
          </button>
        </div>
        <button className="glass px-2 rounded-2xl mt-5" onClick={() => logIn()}>
          Submit
        </button>
        {errorMessage && (
          <p className="text-rose-400 text-xs pt-3">
            {errorMessage !== null && errorMessage}
          </p>
        )}
      </div>
    </div>
  );
}
