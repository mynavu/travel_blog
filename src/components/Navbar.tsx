// U12
import { TreePalm } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { path } from "../App";
import axios from "axios";
import type { CookieSetOptions } from "universal-cookie";
import defaultPfp from "../assets/default_pfp.png";

type NavbarProps = {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  removeCookie: (
    name: "token" | "userId",
    value: any,
    options?: CookieSetOptions | undefined,
  ) => void;
  cookies: { token?: any; userId?: any };
};

export function Navbar({
  isLoggedIn,
  setIsLoggedIn,
  removeCookie,
  cookies,
}: NavbarProps) {
  const logOut = async () => {
    try {
      await axios.post(
        `${path}/users/logout`,
        {},
        {
          headers: { "X-Authorization": cookies.token },
        },
      );
    } catch (e) {
      console.log(e);
    } finally {
      removeCookie("token", { path: "/" });
      removeCookie("userId", { path: "/" });
      setIsLoggedIn(false);
      navigate("/search");
    }
  };

  const navigate = useNavigate();
  return (
    <>
      <div className="fixed top-0 left-0 right-0 flex bg-teal-950 justify-between items-center px-4 py-2 z-50">
        <TreePalm className="text-amber-300" />
        <div>
          {isLoggedIn && (
            <div>
              <img
                className="w-7 h-7 rounded-full object-cover"
                src={`${path}/users/${cookies.userId}/image`}
                onError={(e) => (e.currentTarget.src = defaultPfp)}
              />
              <button
                onClick={() => logOut()}
                className="text-amber-300 text-sm"
              >
                Log Out
              </button>
            </div>
          )}
          {!isLoggedIn && (
            <div className="flex gap-2">
              <button onClick={() => navigate(`/register`)}>Register</button>
              <button onClick={() => navigate(`/login`)}>Login</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
