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
      <div className="header-content">
        <div className="header-left">
          <button className="header-btn" onClick={() => navigate("/")}>
            ЛДПР
          </button>
        </div>
        <div className="header-center">
          <div className="header-center-title">Хотите поделиться событием?</div>
          <div className="header-center-subtitle">
            Вы можете сообщить о нем, для этого нажмите на карту
          </div>
        </div>
        <div className="header-right">
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
      </div>
    </header>
  );
}