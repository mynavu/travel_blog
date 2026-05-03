// U12
import {
  TreePalm,
  Sun,
  Telescope,
  LogIn,
  UserRoundPlus,
  LogOut,
} from "lucide-react";
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
      <div className="fixed top-1 left-25 right-25 rounded-2xl flex bg-teal-950 justify-between items-center px-4 py-2 z-50 glass">
        <TreePalm className="text-amber-300" />
        <div className="flex">
          <Sun className="text-amber-300" />
          <p className="text-amber-300">Mode</p>
        </div>
        <div className="flex">
          <Telescope className="text-amber-300" />
          <p className="text-amber-300">Explore</p>
        </div>
        {isLoggedIn && (
          <div className="flex">
            <LogOut className="text-amber-300" />
            <button onClick={() => logOut()} className="text-amber-300 text-sm">
              Log Out
            </button>
          </div>
        )}
        {isLoggedIn && (
          <img
            className="w-7 h-7 rounded-full object-cover"
            src={`${path}/users/${cookies.userId}/image`}
            onError={(e) => (e.currentTarget.src = defaultPfp)}
            onClick={() => navigate(`/profile/${cookies.userId}`)}
          />
        )}
        {!isLoggedIn && (
          <div className="flex gap-2">
            <div className="flex">
              <UserRoundPlus className="text-amber-300" />
              <button onClick={() => navigate(`/register`)}>Register</button>
            </div>
            <div className="flex">
              <LogIn className="text-amber-300" />
              <button onClick={() => navigate(`/login`)}>Login</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
