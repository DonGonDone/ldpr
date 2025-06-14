import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./Profile.css";

export default function Profile() {
  const [form, setForm] = useState({
    id: "",
    lastname: "",
    firstname: "",
    middlename: "",
    email: "",
    phone: "",
    address: "",
    dob: "",
    avatar: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [shake, setShake] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedAvatar = localStorage.getItem("avatar");
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setForm((prev) => ({
          ...prev,
          id: user.id,
          lastname: user.lastname || "",
          firstname: user.firstname || "",
          middlename: user.middlename || "",
          email: user.email || "",
          dob: user.dob || "",
          phone: user.phone || "",
          address: user.address || "",
        }));
      } catch (e) {
        console.error("Ошибка парсинга user из localStorage:", e);
      }
    }
    if (savedAvatar) {
      setForm((prev) => ({
        ...prev,
        avatar: savedAvatar,
      }));
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotoClick = () => {
    if (!editMode) return;
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({
        ...prev,
        avatar: reader.result,
      }));
      localStorage.setItem("avatar", reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleEditClick = () => {
    setEditMode(true);
    setFeedback("");
  };

  const handleCancel = () => {
    const savedUser = localStorage.getItem("user");
    const savedAvatar = localStorage.getItem("avatar");
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setForm({
          id: user.id,
          lastname: user.lastname || "",
          firstname: user.firstname || "",
          middlename: user.middlename || "",
          email: user.email || "",
          dob: user.dob || "",
          phone: user.phone || "",
          address: user.address || "",
          avatar: savedAvatar || "",
        });
      } catch (e) {
        // ignore
      }
    }
    setEditMode(false);
    setFeedback("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFeedback("");
    setShake(false);
    try {
      const toSend = {
        lastname: form.lastname,
        firstname: form.firstname,
        middlename: form.middlename,
        phone: form.phone,
        address: form.address,
        dob: form.dob,
      };
      const resp = await axios.patch(`http://localhost:5000/api/user/${form.id}`, toSend);
      const updatedUser = {
        ...resp.data,
        email: form.email, // email не меняем
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setFeedback("Данные успешно сохранены!");
      setEditMode(false);
      setTimeout(() => setFeedback(""), 2000);
    } catch (err) {
      setFeedback("Не удалось сохранить изменения");
      setShake(true);
      setTimeout(() => setShake(false), 700);
    }
  };

  return (
    <div className="profile-main-container">
      <div className="profile-left">
        <div
          className={`profile-photo-container ${editMode ? "profile-photo-editable" : ""}`}
          onClick={handlePhotoClick}
          title={editMode ? "Изменить фото" : undefined}
        >
          {form.avatar ? (
            <img src={form.avatar} alt="Аватар" className="profile-photo" />
          ) : (
            <div className="profile-photo-placeholder"></div>
          )}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
            disabled={!editMode}
          />
        </div>
        <button
          className="profile-upload-btn"
          onClick={handlePhotoClick}
          type="button"
          disabled={!editMode}
        >
          Загрузить фото
        </button>
        {!editMode && (
          <button
            className="profile-edit-btn"
            onClick={handleEditClick}
            type="button"
          >
            Изменить данные
          </button>
        )}
        {editMode && (
          <div className="profile-edit-actions">
            <button className="profile-save-btn" onClick={handleSave} type="submit">
              Сохранить
            </button>
            <button className="profile-cancel-btn" onClick={handleCancel} type="button">
              Отмена
            </button>
          </div>
        )}
        {feedback && (
          <div
            className={`profile-feedback ${
              feedback === "Данные успешно сохранены!"
                ? "profile-feedback-success"
                : "profile-feedback-error"
            } ${shake ? "profile-feedback-shake" : ""}`}
          >
            {feedback}
          </div>
        )}
      </div>
      <form className="profile-form-grid" onSubmit={handleSave}>
        <div className="profile-form-row">
          <div className="profile-form-col">
            <label>Фамилия:</label>
            <input
              name="lastname"
              value={form.lastname}
              onChange={handleChange}
              readOnly={!editMode}
            />
          </div>
          <div className="profile-form-col">
            <label>Дата рождения:</label>
            <input
              name="dob"
              type="date"
              value={form.dob}
              onChange={handleChange}
              readOnly={!editMode}
            />
          </div>
        </div>
        <div className="profile-form-row">
          <div className="profile-form-col">
            <label>Имя:</label>
            <input
              name="firstname"
              value={form.firstname}
              onChange={handleChange}
              readOnly={!editMode}
            />
          </div>
          <div className="profile-form-col">
            <label>Телефон:</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              readOnly={!editMode}
            />
          </div>
        </div>
        <div className="profile-form-row">
          <div className="profile-form-col">
            <label>Отчество:</label>
            <input
              name="middlename"
              value={form.middlename}
              onChange={handleChange}
              readOnly={!editMode}
            />
          </div>
          <div className="profile-form-col">
            <label>Адрес:</label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              readOnly={!editMode}
            />
          </div>
        </div>
        <div className="profile-form-row">
          <div className="profile-form-col">
            <label>e-mail:</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              readOnly // email всегда только для чтения!
            />
          </div>
        </div>
      </form>
    </div>
  );
}