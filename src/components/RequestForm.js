import React, { useState } from "react";
import "./RequestForm.css";

// Функция для поиска ближайшего дома по координатам через Яндекс Геокодер
async function getNearestHouseAddress(lat, lng) {
  const apiKey = "8e46e810-5528-4e6e-8349-f7e9b3714ce4";
  const url = `https://geocode-maps.yandex.ru/1.x/?format=json&lang=ru_RU&apikey=${apiKey}&geocode=${lng},${lat}&kind=house&results=1`;
  try {
    const res = await fetch(url);
    if (!res.ok) return "";
    const data = await res.json();
    const featureMember = data.response.GeoObjectCollection.featureMember;
    if (featureMember && featureMember.length > 0) {
      return (
        featureMember[0]?.GeoObject?.metaDataProperty?.GeocoderMetaData?.text ||
        ""
      );
    }
    return "";
  } catch {
    return "";
  }
}

export default function RequestForm({ lat, lng, onClose, onSubmit }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  // Новый getAddress: если не дом, ищем ближайший дом
  const getAddress = async (lat, lng) => {
    const latNum = Number(lat);
    const lngNum = Number(lng);
    const apiKey = "8e46e810-5528-4e6e-8349-f7e9b3714ce4";
    if (isNaN(latNum) || isNaN(lngNum)) return "";
    // Сначала обычный запрос (может вернуть улицу)
    const url = `https://geocode-maps.yandex.ru/1.x/?format=json&lang=ru_RU&apikey=${apiKey}&geocode=${lngNum},${latNum}`;
    try {
      const res = await fetch(url);
      if (!res.ok) return "";
      const data = await res.json();
      const geoObj =
        data.response.GeoObjectCollection.featureMember[0]?.GeoObject;
      const meta = geoObj?.metaDataProperty?.GeocoderMetaData;
      const address = meta?.text || "";
      const kind = meta?.kind || "";
      // Если это не дом, ищем ближайший дом
      if (kind !== "house") {
        const houseAddr = await getNearestHouseAddress(latNum, lngNum);
        return houseAddr || address;
      }
      return address;
    } catch {
      return "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
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
            onChange={(e) => setTitle(e.target.value.slice(0, 50))}
            required
            maxLength={50}
          />
          <textarea
            placeholder="Описание"
            value={description}
            onChange={(e) => setDescription(e.target.value.slice(0, 500))}
            maxLength={500}
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