# LDPR Profile Project

## Описание

Это проект для управления пользовательскими профилями (регистрация, вход, редактирование профиля) на стеке Node.js (Express, Sequelize, SQLite) + React.

---

## Структура проекта

```
LDPR/
│
├── node_modules/                  # node-модули фронтенда
├── public/                        # статика для React
├── server/                        # backend (Node.js/Express)
│   ├── node_modules/
│   ├── db.sqlite                  # база данных SQLite
│   ├── index.js                   # основной файл сервера
│   ├── models.js                  # описание моделей Sequelize
│   ├── package-lock.json
│   └── package.json
│
├── src/                           # исходники React-фронтенда
│   ├── components/                # переиспользуемые компоненты (Header, Footer)
│   ├── pages/                     # страницы (Profile, Login, Register и т.д.)
│   ├── utils/                     # утилиты (например, AuthContext.js)
│   ├── App.css
│   ├── App.js
│   ├── App.test.js
│   ├── index.css
│   ├── index.js
│   ├── logo.svg
│   ├── reportWebVitals.js
│   └── setupTests.js
│
├── .gitignore
├── package-lock.json              # frontend
├── package.json                   # frontend
└── README.md
```

---

## Быстрый старт через Visual Studio Code

### 1. Клонируйте репозиторий и откройте папку проекта в VS Code

```bash
git clone <ВАШ_РЕПОЗИТОРИЙ>
cd LDPR
```

### 2. Установите зависимости

#### Backend

```bash
cd server
npm install
```

#### Frontend

```bash
cd ..
npm install
```

---

### 3. Запуск Backend

В новой вкладке терминала VS Code:

```bash
cd server
node index.js
```

> Сервер запустится на [http://localhost:5000](http://localhost:5000)  
> При первом запуске создаётся база данных `db.sqlite` в папке `server/`.

---

### 4. Запуск Frontend (React)

В новой вкладке терминала (из корня проекта):

```bash
npm start
```

- React-приложение откроется на [http://localhost:3000](http://localhost:3000)

---

## Важно для локальной сети

Если нужно, чтобы другие устройства в вашей сети могли зайти на сайт:
- Запускайте frontend с параметром:
  ```bash
  HOST=0.0.0.0 npm start
  ```
- Дайте другу ваш внутренний IP, например:  
  `http://192.168.1.42:3000`

---

## Советы

- Если добавляете новые поля в `server/models.js`, удаляйте старый `db.sqlite` перед запуском сервера (или используйте миграции).
- Для автоматической перезагрузки backend используйте [`nodemon`](https://www.npmjs.com/package/nodemon):
  ```bash
  npm install -g nodemon
  nodemon index.js
  ```
- Для тестирования API удобно использовать [Postman](https://www.postman.com/) или [Insomnia](https://insomnia.rest/).

---

## Проблемы и решения

- **Поля профиля не сохраняются:**  
  Проверьте, что структура таблицы в `db.sqlite` соответствует модели в `server/models.js`. Если нет — удалите базу и запустите сервер снова.
- **CORS ошибка:**  
  Проверьте, что backend использует пакет `cors`.
- **Не работает вход с другого устройства:**  
  Проверьте настройки firewall и правильность IP-адреса.
- **Поля профиля сбрасываются после входа:**  
  Убедитесь, что backend возвращает все нужные поля при логине (см. `server/index.js`).

---

## Контакты

Если возникнут вопросы — обращайтесь к автору репозитория!