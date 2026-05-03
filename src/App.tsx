import { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import { Search } from "./pages/Search";
import { Navbar } from "./components/Navbar";
import { Profile } from "./pages/Profile";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { CreateButton } from "./components/CreateButton";
import { Blog } from "./pages/Blog";

export const path = `http://localhost:4941/api/v1`;

function AppInner() {
  const [errorMessage, setErrorMessage] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(["token", "userId"]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const background = location.state?.background;

  useEffect(() => {
    (async () => {
      try {
        const token = cookies.token;
        const userId = cookies.userId;
        if (!token || !userId) return;
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
    <div className="bg-teal-900">
      <Navbar
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        cookies={cookies}
        removeCookie={removeCookie}
      />
      {isLoggedIn && <CreateButton cookies={cookies} />}
      <div>
        <Routes location={background || location}>
          <Route path="/search" element={<Search />} />
          <Route path="/profile/:id" element={<Profile cookies={cookies} />} />
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

        {background && (
          <Routes>
            <Route
              path="/blog/:id"
              element={
                <div
                  className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                  onClick={() => navigate(-1)}
                >
                  <div
                    className="bg-teal-950 rounded-xl overflow-hidden"
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
