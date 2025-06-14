import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import "./Header.css";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="header">
      <button className="logo" onClick={() => navigate("/")}>
        ЛДПР
      </button>
      <div className="header-links">
        <a
          href="https://krasnoyarsk.ldpr.ru"
          target="_blank"
          rel="noopener noreferrer"
          className="header-btn"
        >
          САЙТ ЛДПР
        </a>
        {!user ? (
          <button
            className="header-btn"
            onClick={() => navigate("/login")}
            type="button"
          >
            ВОЙТИ
          </button>
        ) : location.pathname === "/profile" ? (
          <button
            className="header-btn"
            onClick={handleLogout}
            type="button"
          >
            ВЫЙТИ
          </button>
        ) : (
          <button
            className="header-btn"
            onClick={() => navigate("/profile")}
            type="button"
          >
            ПРОФИЛЬ
          </button>
        )}
      </div>
    </header>
  );
}