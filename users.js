const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const app = express();


// Create a new user
router.post('/user', (req, res) => {
    const { name, password, role, email } = req.body;

    bcrypt.hash(password, 10, (error, hashedPassword) => {
        if (error) {
            console.log(error);
            res.status(500).json({ error: "Operation failed" });
        } else {
            const newUser = { name, password: hashedPassword, role, email };
            db.query("INSERT INTO users SET ?", newUser, (error, result) => {
                if (error) {
                    console.log(error);
                    res.status(500).json({ error: "Operation failed" });
                } else {
                    const user = { id: result.insertId, ...newUser };
                    const token = generateToken(user);
                    res.status(201).json({
                        message: "User created successfully",
                        token: token,
                    });
                }
            });
        }
    });
});

// Retrieve all users
router.get('/user', (req, res) => {
    db.query("SELECT * FROM users", (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).json({ error: "Failed to retrieve users" });
        } else {
            res.status(200).json(results);
        }
    });
});

// Retrieve a specific user
router.get('/:id', (req, res) => {
    const userId = req.params.id;

    db.query("SELECT * FROM users WHERE id = ?", userId, (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).json({ error: "Failed to retrieve the user" });
        } else if (results.length === 0) {
            res.status(404).json({ error: "User not found" });
        } else {
            res.status(200).json(results[0]);
        }
    });
});

// Update a user
router.put('/:id', (req, res) => {
    const userId = req.params.id;
    const { name, password, role, email } = req.body;
    const updatedUser = { name, password, role, email };

    db.query("UPDATE users SET ? WHERE id = ?", [updatedUser, userId], (error, result) => {
        if (error) {
            console.log(error);
            res.status(500).json({ error: "Failed to update the user" });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ error: "User not found" });
        } else {
            res.status(200).json({ message: "User updated successfully" });
        }
    }
    );
});

// Delete a user
router.delete('/:id', (req, res) => {
    const userId = req.params.id;

    db.query("DELETE FROM users WHERE id = ?", userId, (error, result) => {
        if (error) {
            console.log(error);
            res.status(500).json({ error: "Failed to delete the user" });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ error: "User not found" });
        } else {
            res.status(200).json({ message: "User deleted successfully" });
        }
    });
});

module.exports = router;
