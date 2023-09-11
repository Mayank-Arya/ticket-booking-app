const express = require('express');
const userRouter = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

userRouter.get('/', (req, res) => {
    res.json('Welcome to the user router');
});

userRouter.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const userPresent = await User.findOne({ email });
        if (userPresent) {
            return res.status(400).json({ error: 'User already registered, please login instead.' });
        }

        const hashed = await bcrypt.hash(password, 10); 
        const newUser = new User({ username, email, password: hashed });
        await newUser.save();

        const token = jwt.sign({ userId: newUser._id }, process.env.token, { expiresIn: '24h' });

        res.status(201).json({ message: 'User registered successfully.', token, user: newUser });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Registration failed. Please try again later.' });
    }
});

userRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const userPresent = await User.findOne({ email });
        if (!userPresent) {
            return res.status(401).json({ error: 'User is not registered. Please register first.' });
        }

        const isPasswordValid = await bcrypt.compare(password, userPresent.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Incorrect password. Please enter the correct password.' });
        }

        const token = jwt.sign({ userId: userPresent._id }, process.env.token, { expiresIn: '24h' });
        res.status(200).json({ token, message: 'User logged in successfully.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Login failed. Please try again later.' });
    }
});


userRouter.get("/:id", async(req,res) => {
    const userId = req.params.id
    try{
      const user = await User.findById(userId)
      res.status(200).send(uesr)
    }
    catch(err){
        console.log(err.message)
    }
})


// User Update endpoint
userRouter.put('/:id', async (req, res) => {
    const userId = req.params.id;
    const { username, email} = req.body;
    try {
        // Find the user by their ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Update user information
        user.username = username || user.username; 
        user.email = email || user.email;

        // Save the updated user
        await user.save();

        res.status(200).json({ message: 'User information updated successfully.', user });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'User update failed. Please try again later.' });
    }
});





module.exports = userRouter;
