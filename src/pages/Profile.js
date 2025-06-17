import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useAuth } from "../utils/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    id: user?.id || "",
    lastname: user?.lastname || "",
    firstname: user?.firstname || "",
    middlename: user?.middlename || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    dob: user?.dob || "",
    photo: user?.photo || "",
  });
  const [edit, setEdit] = useState(false);
  const [myRequests, setMyRequests] = useState([]);
  const [photoPreview, setPhotoPreview] = useState(user?.photo || "");
  const [feedback, setFeedback] = useState({ show: false, success: true, message: "", shake: false });
  const fileInputRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    if (form.id) {
      axios
        .get(`http://localhost:5000/api/user/${form.id}/requests`)
        .then((res) => setMyRequests(res.data));
    }
  }, [form.id]);

  // Преобразование даты для input type="date"
  const getDateForInput = (dateStr) => {
    if (!dateStr) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(dateStr)) {
      const [d, m, y] = dateStr.split(".");
      return `${y}-${m}-${d}`;
    }
    return "";
  };

  const handleDateChange = (e) => {
    const val = e.target.value;
    if (val) {
      const [y, m, d] = val.split("-");
      setForm({ ...form, dob: `${d}.${m}.${y}` });
    } else {
      setForm({ ...form, dob: "" });
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPhotoPreview(ev.target.result);
      setForm((prev) => ({ ...prev, photo: ev.target.result }));
    };
    reader.readAsDataURL(file);
  };

  // Уведомление с анимацией
  const showFeedback = (success, message) => {
    setFeedback({ show: true, success, message, shake: !success });
    setTimeout(() => setFeedback({ show: false, success: true, message: "", shake: false }), 2500);
  };

  const handleSave = async () => {
    try {
      const res = await axios.patch(`http://localhost:5000/api/user/${form.id}`, form);
      setEdit(false);
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      showFeedback(true, "Данные успешно сохранены!");
    } catch (e) {
      showFeedback(false, "Ошибка при сохранении данных!");
    }
  };

  const handleToggleDone = async (req) => {
    try {
      const res = await axios.patch(
        `http://localhost:5000/api/requests/${req.id}/done`,
        { done: !req.done }
      );
      setMyRequests((prev) =>
        prev.map((r) => (r.id === req.id ? { ...r, done: res.data.done } : r))
      );
    } catch (e) {
      alert("Ошибка при изменении статуса");
    }
  };

  // Функция для "очистки" адреса от страны и города
  function cleanAddress(address) {
    if (!address) return "";
    return address
      .replace(/^Россия,\s*/i, "")
      .replace(/^[^,]+,\s*/i, "");
  }

  if (!user) {
    return <div>Войдите в аккаунт, чтобы просматривать профиль.</div>;
  }

  return (
    <main className="profile-main-container">
      <div className="profile-left">
        <div
          className={`profile-photo-container${edit ? " profile-photo-editable" : ""}`}
          onClick={() => edit && fileInputRef.current && fileInputRef.current.click()}
          title={edit ? "Изменить фото" : ""}
          style={{ cursor: edit ? "pointer" : "default" }}
        >
          {photoPreview ? (
            <img
              src={photoPreview}
              alt="Фото профиля"
              className="profile-photo"
            />
          ) : (
            <div className="profile-photo-placeholder" />
          )}
        </div>
        {edit && (
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={handlePhotoChange}
          />
        )}
        {!edit ? (
          <button className="profile-edit-btn" onClick={() => setEdit(true)}>
            Редактировать
          </button>
        ) : (
          <div className="profile-edit-actions" style={{ flexDirection: "column", alignItems: "center" }}>
            <button className="profile-save-btn" onClick={handleSave}>
              Сохранить
            </button>
            <button
              className="profile-cancel-btn"
              onClick={() => {
                setEdit(false);
                setForm({
                  ...user,
                  dob: user?.dob || "",
                  photo: user?.photo || "",
                });
                setPhotoPreview(user?.photo || "");
              }}
              type="button"
            >
              Отмена
            </button>
          </div>
        )}
        <div style={{ minHeight: 60, width: "100%" }}>
          {feedback.show && (
            <div
              className={
                "profile-feedback " +
                (feedback.success
                  ? "profile-feedback-success"
                  : "profile-feedback-error") +
                (feedback.shake ? " profile-feedback-shake" : "")
              }
              style={{ marginTop: 18 }}
            >
              {feedback.message}
            </div>
          )}
        </div>
      </div>
      <div className="profile-form-grid">
        <form className="profile-form" onSubmit={e => e.preventDefault()}>
          <div className="profile-form-row">
            <div className="profile-form-col short-field">
              <label>Фамилия:</label>
              <input
                name="lastname"
                value={form.lastname}
                onChange={handleChange}
                disabled={!edit}
              />
            </div>
            <div className="profile-form-col short-field">
              <label>Имя:</label>
              <input
                name="firstname"
                value={form.firstname}
                onChange={handleChange}
                disabled={!edit}
              />
            </div>
            <div className="profile-form-col short-field">
              <label>Отчество:</label>
              <input
                name="middlename"
                value={form.middlename}
                onChange={handleChange}
                disabled={!edit}
              />
            </div>
          </div>
          <div className="profile-form-row">
            <div className="profile-form-col">
              <label>Email:</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                disabled
              />
            </div>
            <div className="profile-form-col">
              <label>Телефон:</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                disabled={!edit}
              />
            </div>
          </div>
          <div className="profile-form-row">
            <div className="profile-form-col">
              <label>Адрес:</label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                disabled={!edit}
              />
            </div>
            <div className="profile-form-col">
              <label>Дата рождения:</label>
              <input
                name="dob"
                type="date"
                value={getDateForInput(form.dob)}
                onChange={handleDateChange}
                disabled={!edit}
                pattern="\d{4}-\d{2}-\d{2}"
              />
            </div>
          </div>
        </form>
        <div className="profile-requests-block">
          <h2 style={{ marginTop: 32, marginBottom: 16, color: "#386cb3" }}>Мои заявки</h2>
          {myRequests.length === 0 ? (
            <div className="profile-feedback">У вас пока нет заявок.</div>
          ) : (
            <ul className="profile-requests-list">
              {[...myRequests].reverse().map((req) => (
                <li
                  key={req.id}
                  style={{
                    cursor: "pointer",
                    opacity: req.done ? 0.6 : 1,
                    position: "relative",
                    paddingLeft: 32,
                  }}
                  title="Показать на карте"
                  onClick={() => {
                    navigate("/", {
                      state: {
                        focusCoords: { lat: req.lat, lng: req.lng },
                        focusZoom: 16,
                      },
                    });
                  }}
                >
                  <input
                    type="checkbox"
                    checked={!!req.done}
                    onChange={e => {
                      e.stopPropagation(); // <-- важно!
                      handleToggleDone(req);
                    }}
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 14,
                      accentColor: "#2ea83a",
                      width: 18,
                      height: 18,
                      cursor: "pointer"
                    }}
                  />
                  {cleanAddress(req.address) && (
                    <div style={{ color: "#386cb3", fontWeight: 600, marginBottom: 2 }}>
                      {cleanAddress(req.address)}
                    </div>
                  )}
                  <div style={{ fontWeight: "bold" }}>{req.title}</div>
                  {req.description && (
                    <div style={{ color: "#444", marginTop: 2 }}>{req.description}</div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}