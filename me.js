const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");



// Retrieve current user
router.get('/me', (req, res) => {
    const userId = req.user.id;

    db.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: 'An error occurred' });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ message: 'User was not found' });
      }
  
      const user = results[0];
      // Supprimer le champ password avant de renvoyer les données
      delete user.password;
  
      return res.status(200).json(user);
    });
});

module.exports = router;
