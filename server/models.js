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

module.exports = { sequelize, User };