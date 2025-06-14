const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sequelize, User } = require('./models');
const app = express();
const SECRET = 'YOUR_SECRET_KEY'; // замените на свой секрет!

app.use(cors());
app.use(express.json());

app.post('/api/register', async (req, res) => {
  const { lastname, firstname, middlename, email, password, phone, address, dob } = req.body;
  console.log('Запрос на регистрацию:', req.body);

  if (!lastname || !firstname || !email || !password) {
    console.log('Ошибка: не все обязательные поля заполнены');
    return res.status(400).json({ error: 'Все обязательные поля должны быть заполнены' });
  }
  try {
    const hash = await bcrypt.hash(password, 8);
    const user = await User.create({ lastname, firstname, middlename, email, password: hash, phone, address, dob });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      SECRET,
      { expiresIn: '7d' }
    );

    console.log('Пользователь успешно зарегистрирован:', user.email);

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        lastname: user.lastname,
        firstname: user.firstname,
        middlename: user.middlename,
        phone: user.phone,
        address: user.address,
        dob: user.dob
      }
    });
  } catch (e) {
    console.error('Ошибка при регистрации:', e);
    if (e.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
    }
    res.status(400).json({ error: 'User registration failed', details: e.message });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Запрос на вход:', req.body);

  if (!email || !password) {
    console.log('Ошибка: не введены email или пароль');
    return res.status(400).json({ error: 'Введите email и пароль' });
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log('Ошибка: пользователь не найден');
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Ошибка: неверный пароль');
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      SECRET,
      { expiresIn: '7d' }
    );

    console.log('Вход успешен:', user.email);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        lastname: user.lastname,
        firstname: user.firstname,
        middlename: user.middlename,
        phone: user.phone,
        address: user.address,
        dob: user.dob
      }
    });
  } catch (e) {
    console.error('Ошибка при входе:', e);
    res.status(500).json({ error: 'Ошибка сервера', details: e.message });
  }
});

// PATCH — обновление профиля
app.patch('/api/user/:id', async (req, res) => {
  const { id } = req.params;
  const { lastname, firstname, middlename, phone, address, dob } = req.body;
  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: 'Пользователь не найден' });
    user.lastname = lastname ?? user.lastname;
    user.firstname = firstname ?? user.firstname;
    user.middlename = middlename ?? user.middlename;
    user.phone = phone ?? user.phone;
    user.address = address ?? user.address;
    user.dob = dob ?? user.dob;
    await user.save();
    res.json({
      id: user.id,
      email: user.email,
      lastname: user.lastname,
      firstname: user.firstname,
      middlename: user.middlename,
      phone: user.phone,
      address: user.address,
      dob: user.dob,
    });
  } catch (e) {
    console.error('Ошибка при обновлении профиля:', e);
    res.status(500).json({ error: 'Не удалось сохранить изменения' });
  }
});

const PORT = 5000;
sequelize.authenticate()
  .then(() => {
    console.log('База данных успешно запущена!');
    return sequelize.sync();
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Сервер запущен на http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Ошибка при запуске базы данных:', err);
  });