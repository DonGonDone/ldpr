import React from "react";
import "./Home.css";

export default function Home() {
  return (
    <main>
      <div className="main-banner">
        <div className="centered-banner-text">
          <h1>ХОТИТЕ ЧЕМ-ТО ПОДЕЛИТЬСЯ?</h1>
          <p className="subtitle">
            Вы можете заполнить данные о благоприятном или неблагоприятном событии, нажав на кнопку <b>«Поделиться»</b>
          </p>
          <button className="main-action">Поделиться</button>
        </div>
      </div>
      <div className="main-map">
        <iframe
          title="YandexMap"
          src="https://yandex.ru/map-widget/v1/?um=constructor%3AExample"
          width="100%"
          height="600"
          frameBorder="0"
          style={{ border: 0 }}
          allowFullScreen
        ></iframe>
      </div>
    </main>
  );
}