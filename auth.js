const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// Login route
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM users WHERE email = ?", email, (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).json({ error: "Failed to login" });
        } else if (results.length === 0) {
            res.status(401).json({ error: "Invalid email or password" });
        } else {
            const user = results[0];
            bcrypt.compare(password, user.password, (error, isMatch) => {
                if (error) {
                    console.log(error);
                    res.status(500).json({ error: "Failed to login" });
                } else if (isMatch) {
                    const token = generateToken(user);
                    res.status(200).json({
                        message: "Login successful",
                        token: token,
                    });
                } else {
                    res.status(401).json({ error: "Invalid email or password" });
                }
            });
        }
    });
});

module.exports = router;
