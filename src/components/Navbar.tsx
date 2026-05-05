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
  setIsNight: (value: boolean | ((prev: boolean) => boolean)) => void;
};

export function Navbar({
  isLoggedIn,
  setIsLoggedIn,
  removeCookie,
  cookies,
  setIsNight,
}: NavbarProps) {
  const navigate = useNavigate();

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

  return (
    <>
      <div className="fixed top-3 left-25 right-25 rounded-2xl flex bg-teal-950 justify-between items-center px-4 py-1.5 z-50 glass">
        <TreePalm className="text-amber-300 amber-glow" size={25} />
        <div
          className="flex items-center gap-1 cursor-pointer"
          onClick={() => setIsNight((prev: boolean) => !prev)}
        >
          <Sun className="text-amber-300" size={18} />
          <p className="text-amber-300 text-sm">Mode</p>
        </div>
        <div
          className="flex items-center gap-1 cursor-pointer"
          onClick={() => navigate("/search")}
        >
          <Telescope className="text-amber-300" size={18} />
          <p className="text-amber-300 text-sm">Explore</p>
        </div>
        {isLoggedIn && (
          <div
            onClick={() => logOut()}
            className="flex items-center gap-1 cursor-pointer"
          >
            <LogOut className="text-amber-300" size={18} />
            <p className="text-amber-300 text-sm">Logout</p>
          </div>
        )}
        {isLoggedIn && (
          <img
            className="w-7 h-7 rounded-full object-cover cursor-pointer"
            src={`${path}/users/${cookies.userId}/image`}
            onError={(e) => (e.currentTarget.src = defaultPfp)}
            onClick={() => navigate(`/profile/${cookies.userId}`)}
          />
        )}
        {!isLoggedIn && (
          <>
            <div
              className="flex items-center gap-1 cursor-pointer"
              onClick={() => navigate(`/register`)}
            >
              <UserRoundPlus className="text-amber-300" size={18} />
              <p className="text-amber-300 text-sm">Register</p>
            </div>
            <div
              className="flex items-center gap-1 cursor-pointer"
              onClick={() => navigate(`/login`)}
            >
              <LogIn className="text-amber-300" size={18} />
              <p className="text-amber-300 text-sm">Login</p>
            </div>
          </>
        )}
      </div>
    </>
  );
}
