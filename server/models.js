const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './db.sqlite'
});

const User = sequelize.define('User', {
  lastname: DataTypes.STRING,
  firstname: DataTypes.STRING,
  middlename: DataTypes.STRING,
  email: {
    type: DataTypes.STRING,
    unique: true,
  },
  password: DataTypes.STRING,
  phone: DataTypes.STRING,
  address: DataTypes.STRING,
  dob: DataTypes.STRING
});

// Новая модель заявки
const Request = sequelize.define('Request', {
  title: DataTypes.STRING,
  description: DataTypes.TEXT,
  lat: DataTypes.FLOAT,
  lng: DataTypes.FLOAT,
  address: DataTypes.STRING,
  done: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

// Связь: заявка принадлежит пользователю
Request.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Request, { foreignKey: 'userId' });

module.exports = { sequelize, User, Request };