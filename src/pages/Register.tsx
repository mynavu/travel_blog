// U11
import { path } from "../App";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import type { CookieSetOptions } from "universal-cookie";
import { ProfileForm } from "../components/ProfileForm";

type RegisterProps = {
  setCookie: (
    name: "token" | "userId",
    value: any,
    options?: CookieSetOptions | undefined,
  ) => void;
  setIsLoggedIn: (value: boolean) => void;
};
export function Register({ setCookie, setIsLoggedIn }: RegisterProps) {
  const navigate = useNavigate();

  const register = async (data: {
    email: string;
    firstName: string;
    lastName: string;
    password?: string;
    imageFile?: File | null;
  }) => {
    try {
      await axios.post(`${path}/users/register`, {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        password: data.password,
      });

      const result = await axios.post(`${path}/users/login`, {
        email: data.email,
        password: data.password,
      });

      setCookie("token", result.data.token);
      setCookie("userId", result.data.userId);
      setIsLoggedIn(true);

      if (data.imageFile) {
        await axios.put(
          `${path}/users/${result.data.userId}/image`,
          data.imageFile,
          {
            headers: {
              "X-Authorization": result.data.token,
              "Content-Type": data.imageFile.type,
            },
          },
        );
      }

      navigate("/search");
    } catch (e: any) {
      throw e;
    }
  };

  return (
    <div className="mt-20 glass">
      <ProfileForm mode="register" onSubmit={register} />
    </div>
  );
}
