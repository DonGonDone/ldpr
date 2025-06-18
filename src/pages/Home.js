import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import { useLocation, useNavigate } from "react-router-dom";
import "./Home.css";
import RequestForm from "../components/RequestForm";
import { useAuth } from "../utils/AuthContext";

export default function Home() {
  const [requests, setRequests] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const [mapState, setMapState] = useState({
    center: [56.01, 92.85], // Координаты центра Красноярска
    zoom: 11,
  });
  const mapRef = useRef();
  const { user } = useAuth();
  const [formCoords, setFormCoords] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:5000/api/requests").then((res) => setRequests(res.data));
  }, []);

  useEffect(() => {
    if (location.state?.focusCoords) {
      setMapState({
        center: [location.state.focusCoords.lat, location.state.focusCoords.lng],
        zoom: location.state.focusZoom || 16,
      });
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // При клике на заявку — центрируем карту и открываем балун
  const handleRequestClick = (req) => {
    setMapState({
      center: [req.lat, req.lng],
      zoom: 16,
    });
    // Открытие балуна
    setTimeout(() => {
      if (mapRef.current) {
        const map = mapRef.current;
        const geoObjects = map.geoObjects || (map.c && map.c.geoObjects);
        if (geoObjects && geoObjects.getLength) {
          for (let i = 0; i < geoObjects.getLength(); i++) {
            const placemark = geoObjects.get(i);
            if (
              placemark.geometry.getCoordinates()[0] === req.lat &&
              placemark.geometry.getCoordinates()[1] === req.lng
            ) {
              placemark.balloon.open();
              break;
            }
          }
        }
      }
    }, 400);
  };

  const handleFormSubmit = async (data) => {
    try {
      await axios.post("http://localhost:5000/api/requests", {
        ...data,
        userId: user?.id,
      });
      setShowForm(false);
      setFormCoords(null);
      const res = await axios.get("http://localhost:5000/api/requests");
      setRequests(res.data);
    } catch (e) {
      alert("Ошибка при создании заявки");
    }
  };

  // Функция для "очистки" адреса от страны и города
  function cleanAddress(address) {
    if (!address) return "";
    return address
      .replace(/^Россия,\s*/i, "")
      .replace(/^[^,]+,\s*/i, ""); // удаляет первую часть до запятой (город)
  }

  return (
    <main className="home-flex-main">
      <div className="home-requests-panel">
        <div className="home-requests-panel-title">Все заявки</div>
        <div className="home-requests-panel-list">
          {[...requests].reverse().map((req) => (
            <div
              className="home-request-profile-style"
              key={req.id}
              onClick={() => handleRequestClick(req)}
              tabIndex={0}
              title="Показать на карте"
            >
              {cleanAddress(req.address) && (
                <div className="home-request-address">{cleanAddress(req.address)}</div>
              )}
              <div className="home-request-title">{req.title}</div>
              {req.description && (
                <div className="home-request-description">
                  {req.description.length > 500
                    ? req.description.slice(0, 500) + "…"
                    : req.description}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="home-map-panel">
        <YMaps
          query={{
            load: "package.full",
          }}
        >
          <Map
            state={mapState}
            width="100%"
            height="100%"
            instanceRef={mapRef}
            modules={["geoObject.addon.balloon"]}
            controls={[]} // это гарантировано убирает все контролы, включая поиск
            onClick={(e) => {
              if (!user) {
                navigate("/login");
                return;
              }
              const coords = e.get("coords");
              setFormCoords({ lat: coords[0], lng: coords[1] });
              setShowForm(true);
            }}
          >
            {requests.map((req) => (
              <Placemark
                key={req.id}
                geometry={[req.lat, req.lng]}
                properties={{
                  balloonContentHeader: req.title,
                  balloonContentBody: req.description,
                  balloonContentFooter: req.address
                    ? `Адрес: ${req.address}`
                    : "",
                }}
                options={{
                  preset: req.done
                    ? "islands#greenDotIcon"
                    : "islands#redDotIcon",
                  openBalloonOnClick: true,
                }}
              />
            ))}
          </Map>
        </YMaps>
        {showForm && formCoords && (
          <RequestForm
            lat={formCoords.lat}
            lng={formCoords.lng}
            onClose={() => setShowForm(false)}
            onSubmit={handleFormSubmit}
          />
        )}
      </div>
    </main>
  );
}