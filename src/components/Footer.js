import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-block">
        <div>
          <h4>КОНТАКТЫ</h4>
          <div>БПИ22-01, БПИ22-02</div>
          <div className="footer-info">
            <div>
              <span role="img" aria-label="address">📍</span>
              Адрес: <span className="footer-bold">Проспект им. газеты Красноярский Рабочий, 160Е</span>
            </div>
            <div>
              <span role="img" aria-label="phone">📞</span>
              Номер телефона: <span className="footer-bold">+123456789</span>
            </div>
            <div>
              <span role="img" aria-label="email">📧</span>
              Электронная почта: <span className="footer-bold">zrenie-24@yandex.ru || ldpr@email</span>
            </div>
          </div>
        </div>
        <div>
          <h4>CATEGORIES</h4>
          <div>Proin vitae est lorem</div>
        </div>
        <div>
          <h4>CUSTOMER SUPPORT</h4>
          <div>Vivamus egestas sapien</div>
        </div>
        <div>
          <h4>TOP LINK</h4>
          <div>Praesent pulvinar gravida</div>
        </div>
      </div>
    </footer>
  );        
}

