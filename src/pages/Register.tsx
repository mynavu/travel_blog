// U11
import { use, useState } from "react";
import { path } from "../App";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import type { CookieSetOptions } from "universal-cookie";

type RegisterProps = {
  setCookie: (
    name: "token" | "userId",
    value: any,
    options?: CookieSetOptions | undefined,
  ) => void;
  setIsLoggedIn: (value: boolean) => void;
};
export function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [errorMessage, setErrorMessage] = useState<null | string>(null);

  const navigate = useNavigate();

  const register = async () => {
    if (
      email.length === 0 ||
      firstName.length === 0 ||
      lastName.length === 0 ||
      password.length === 0
    )
      return;
    try {
      const result = await axios.post(`${path}/users/register`, {
        email,
        firstName,
        lastName,
        password,
      });
      navigate("/login");
    } catch (e: any) {
      setErrorMessage(e.response?.statusText || "An error occurred");
      console.log(e.response);
    }
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p>Register</p>
      <p>email:</p>
      <input
        className="bg-white"
        type="text"
        onChange={(e) => setEmail(e.target.value)}
      />
      <p>first name:</p>
      <input
        className="bg-white"
        type="text"
        onChange={(e) => setFirstName(e.target.value)}
      />
      <p>last name:</p>
      <input
        className="bg-white"
        type="text"
        onChange={(e) => setLastName(e.target.value)}
      />
      <p>password:</p>
      <input
        className="bg-white"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={() => register()}>Submit</button>
      <p>{errorMessage !== null && errorMessage}</p>
    </div>
  );
}
