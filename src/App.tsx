import { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";
import "./App.css";
import { Search } from "./pages/Search";
import { Navbar } from "./components/Navbar";
import { Profile } from "./pages/Profile";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { CreateButton } from "./components/CreateButton";
import { Blog } from "./pages/Blog";
import Grainient from "./components/Grainient";

export const path = `http://localhost:4941/api/v1`;

function AppInner() {
  const [cookies, setCookie, removeCookie] = useCookies(["token", "userId"]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const background = location.state?.background;
  const [isNight, setIsNight] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const mode = localStorage.getItem("isNight");
      setIsNight(mode === "true");

      const token = cookies.token;
      const userId = cookies.userId;

      console.log("AUTH CHECK - token:", token, "userId:", userId);

      if (!token || !userId) {
        console.log("AUTH CHECK - no token/userId, setting logged out");
        setIsLoggedIn(false);
        setAuthChecked(true);
        return;
      }

      try {
        console.log("AUTH CHECK - calling API...");
        const result = await axios.get(`${path}/users/${userId}`, {
          headers: { "X-Authorization": token },
        });
        console.log(
          "AUTH CHECK - response:",
          result.data,
          "status:",
          result.status,
        );
        console.log("AUTH CHECK - has email:", !!result.data.email);
        setIsLoggedIn(result.status === 200 && !!result.data.email);
      } catch (e: any) {
        console.log(
          "AUTH CHECK - failed:",
          e.response?.status,
          e.response?.data,
        );
        setIsLoggedIn(false);
        removeCookie("token");
        removeCookie("userId");
      } finally {
        setAuthChecked(true);
        console.log("AUTH CHECK - done, authChecked set to true");
      }
    };

    checkAuth();
  }, [cookies.token, cookies.userId]);

  useEffect(() => {
    if (background) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [background]);

  console.log("RENDER - isLoggedIn:", isLoggedIn, "authChecked:", authChecked);

  if (!authChecked) return null;

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <div style={{ position: "fixed", inset: 0, zIndex: -1 }}>
        <Grainient
          color1={isNight ? "#003c5e" : "#007498"}
          color2={isNight ? "#002e4a" : "#003b5e"}
          color3={isNight ? "#0e538a" : "#55b3ff"}
          timeSpeed={0.25}
          colorBalance={0.09}
          warpStrength={1}
          warpFrequency={5}
          warpSpeed={2.5}
          warpAmplitude={50}
          blendAngle={0}
          blendSoftness={0.05}
          rotationAmount={500}
          noiseScale={2}
          grainAmount={0.1}
          grainScale={2}
          grainAnimated={false}
          contrast={1.5}
          gamma={1}
          saturation={1}
          centerX={0}
          centerY={0}
          zoom={0.9}
        />
      </div>
      <Navbar
        setIsNight={setIsNight}
        isNight={isNight}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        cookies={cookies}
        removeCookie={removeCookie}
      />
      {isLoggedIn && <CreateButton cookies={cookies} />}
      <div>
        <Routes location={background || location}>
          <Route path="/" element={<Navigate to="/search" replace />} />
          <Route path="/search" element={<Search />} />
          <Route
            path="/profile/:id"
            element={<Profile cookies={cookies} authChecked={authChecked} />}
          />
          <Route
            path="/blog/:id"
            element={<Blog cookies={cookies} isLoggedIn={isLoggedIn} />}
          />
          <Route
            path="/login"
            element={
              <Login setIsLoggedIn={setIsLoggedIn} setCookie={setCookie} />
            }
          />
          <Route
            path="/register"
            element={
              <Register setCookie={setCookie} setIsLoggedIn={setIsLoggedIn} />
            }
          />
          <Route path="*" />
        </Routes>
        {background && (
          <Routes>
            <Route
              path="/blog/:id"
              element={
                <div
                  className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                  onClick={() =>
                    navigate(background.pathname + background.search, {
                      replace: true,
                    })
                  }
                >
                  <div
                    className="bg-teal-950 rounded-xl overflow-hidden glass"
                    style={{ width: "90vw", height: "90vh" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Blog cookies={cookies} isLoggedIn={isLoggedIn} />
                  </div>
                </div>
              }
            />
          </Routes>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppInner />
    </Router>
  );
}

export default App;
