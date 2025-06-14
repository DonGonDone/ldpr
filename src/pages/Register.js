import React, { useState } from "react";
import axios from "axios";
import "./Auth.css";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    lastname: "",
    firstname: "",
    middlename: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.lastname || !form.firstname || !form.email || !form.password) {
      setError("Пожалуйста, заполните обязательные поля");
      return;
    }
    try {
      const response = await axios.post("http://localhost:5000/api/register", form);
      console.log("Ответ сервера /api/register:", response.data);

      if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        console.log("В localStorage USER:", localStorage.getItem("user"));
        navigate("/profile");
      } else {
        setError("Ошибка при регистрации: некорректный ответ сервера");
      }
    } catch (err) {
      setError("Ошибка при регистрации");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Регистрация</h2>
        <input
          name="lastname"
          placeholder="Фамилия*"
          value={form.lastname}
          onChange={handleChange}
          required
        />
        <input
          name="firstname"
          placeholder="Имя*"
          value={form.firstname}
          onChange={handleChange}
          required
        />
        <input
          name="middlename"
          placeholder="Отчество"
          value={form.middlename}
          onChange={handleChange}
        />
        <input
          name="email"
          type="email"
          placeholder="E-mail*"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Пароль*"
          value={form.password}
          onChange={handleChange}
          required
        />
        {error && <div className="auth-error">{error}</div>}
        <button type="submit">Зарегистрироваться</button>
        <div className="auth-login-tip">
          Есть аккаунт?{" "}
          <Link to="/login" className="auth-login-link">
            Войти
          </Link>
        </div>
      </form>
    </div>
  );
}