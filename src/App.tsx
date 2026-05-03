import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import axios from "axios";
import { useCookies } from "react-cookie";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { Search } from "./pages/Search";
import { Navbar } from "./components/Navbar";
import { Profile } from "./pages/Profile";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { CreateButton } from "./components/CreateButton";
import { Blog } from "./pages/Blog";
export const path = `http://localhost:4941/api/v1`;

function App() {
  const [errorMessage, setErrorMessage] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(["token", "userId"]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Authenticate
  useEffect(() => {
    (async () => {
      try {
        const token = cookies.token;
        const userId = cookies.userId;
        if (!token || !userId) {
          return;
        }
        const result = await axios.get(`${path}/users/${userId}`, {
          headers: { "X-Authorization": token },
        });
        if (result.data.email) {
          setIsLoggedIn(true);
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  return (
    <>
      <div className="bg-teal-900">
        <Router>
          <Navbar
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
            cookies={cookies}
            removeCookie={removeCookie}
          />
          {isLoggedIn && <CreateButton cookies={cookies} />}
          <div>
            <Routes>
              {/* change so the url has the search requests */}
              <Route path="/search" element={<Search />} />
              <Route
                path="/profile/:id"
                element={<Profile cookies={cookies} />}
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
              <Route path="/register" element={<Register />} />
              <Route path="*" />
            </Routes>
          </div>
        </Router>
      </div>
    </>
  );
}

export default App;
