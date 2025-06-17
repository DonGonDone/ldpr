import React, { useState } from "react";
import "./RequestForm.css";

export default function RequestForm({ lat, lng, onClose, onSubmit }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

const getAddress = async (lat, lng) => {
  const latNum = Number(lat);
  const lngNum = Number(lng);
  const apiKey = "8e46e810-5528-4e6e-8349-f7e9b3714ce4";
  if (isNaN(latNum) || isNaN(lngNum)) {
    console.log("Некорректные координаты:", lat, lng);
    return "";
  }
  const url = `https://geocode-maps.yandex.ru/1.x/?format=json&lang=ru_RU&apikey=${apiKey}&geocode=${lngNum},${latNum}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.log("Ошибка геокодера:", res.status, res.statusText);
      return "";
    }
    const data = await res.json();
    const address =
      data.response.GeoObjectCollection.featureMember[0]?.GeoObject
        ?.metaDataProperty?.GeocoderMetaData?.text || "";
    console.log("Адрес:", address);
    return address;
  } catch (e) {
    console.log("Ошибка запроса к геокодеру:", e);
    return "";
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Проверка координат перед запросом
    console.log("lat:", lat, "lng:", lng);
    const address = await getAddress(lat, lng);
    setLoading(false);
    onSubmit({ title, description, lat, lng, address });
  };

  return (
    <div className="request-modal-backdrop">
      <div className="request-modal">
        <h3>Создать заявку</h3>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Заголовок*"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Описание"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <div className="request-modal-coords">
            Координаты: {lat && lng ? `${lat.toFixed(6)}, ${lng.toFixed(6)}` : "—"}
          </div>
          <div className="request-modal-actions">
            <button
              type="submit"
              className="request-modal-btn"
              disabled={loading}
            >
              {loading ? "Определяем адрес..." : "Создать"}
            </button>
            <button
              type="button"
              className="request-modal-btn cancel"
              onClick={onClose}
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}