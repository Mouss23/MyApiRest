const express = require("express");
const dotenv = require("dotenv");
const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require('path');

dotenv.config({ path: "./.env" });

const app = express();

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE
});

app.use(express.json());

db.connect((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("MYSQL Connecté...");
  }
});


// Generate JWT token
function generateToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const options = {
    expiresIn: process.env.JWT_EXPIRES_IN
  };

  return jwt.sign(payload, process.env.JWT_SECRET, options);
}

// Importation des modules de routes
const usersRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const meRoute = require('./routes/me');

// Utilisation des modules de route
app.use('/users', usersRoute);
app.use('/auth', authRoute);
app.use('/me', meRoute);

// Demarrage du serveur
app.listen(5000, () => {
  console.log("Port 5000");
});
