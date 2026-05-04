// U11
import { use, useState } from "react";
import { path } from "../App";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import type { CookieSetOptions } from "universal-cookie";
import defaultPfp from "../assets/default_pfp.png";

type RegisterProps = {
  setCookie: (
    name: "token" | "userId",
    value: any,
    options?: CookieSetOptions | undefined,
  ) => void;
  setIsLoggedIn: (value: boolean) => void;
};
export function Register({ setCookie, setIsLoggedIn }: RegisterProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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
      await axios.post(`${path}/users/register`, {
        email,
        firstName,
        lastName,
        password,
      });

      // login
      const result = await axios.post(`${path}/users/login`, {
        email,
        password,
      });
      setCookie("token", result.data.token);
      setCookie("userId", result.data.userId);
      setIsLoggedIn(true);
      if (imageFile) {
        await axios.put(
          `${path}/users/${result.data.userId}/image`,
          imageFile,
          {
            headers: {
              "X-Authorization": result.data.token,
              "Content-Type": imageFile.type,
            },
          },
        );
      }
      navigate("/search");
    } catch (e: any) {
      setErrorMessage(e.response?.statusText || "An error occurred");
      console.log(e.response);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) setImagePreview(URL.createObjectURL(file));
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <div className="glass p-5 rounded-2xl flex flex-col gap-2 text-white text-sm items-center">
        <p className="text-white text-2xl">Register</p>
        <div className="flex gap-2">
          <p className=" ">Email:</p>
          <input
            className="bg-white glass rounded-2xl"
            type="text"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full">
          <p>First Name:</p>
          <input
            className="glass rounded-2xl"
            type="text"
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <p>Last Name:</p>
          <input
            className="bg-white glass rounded-2xl"
            type="text"
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <p>Password:</p>
          <input
            className="bg-white glass rounded-2xl"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <img
            className="w-20 h-20 rounded-full object-cover"
            src={imagePreview || defaultPfp}
            onError={(e) => (e.currentTarget.src = defaultPfp)}
          />

          <input
            type="file"
            accept="image/png, image/jpeg, image/gif"
            className="bg-white text-black text-xs w-full"
            onChange={handleImageChange}
          />
          {imageFile !== null && (
            <div
              onClick={() => {
                setImageFile(null);
                setImagePreview(null);
              }}
              className="bg-red-600"
            >
              Remove profile picture
            </div>
          )}
        </div>
        <button className="glass px-2 rounded-2xl" onClick={() => register()}>
          Submit
        </button>
        <p>{errorMessage !== null && errorMessage}</p>
      </div>
    </div>
  );
}
