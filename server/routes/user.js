const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const router = express.Router();

const verifyUser = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ status: false, message: "No token" });
    }
    const decoded = jwt.verify(token, process.env.KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ status: false, message: "Invalid token" });
  }
};

router.get('/verify', verifyUser, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }
    return res.json({ status: true, message: "Authorized", user: { firstname: user.firstname, email: user.email, lastname: user.lastname, userID: user._id } });
    
  } catch (error) {
    console.error("Error fetching user data:", error);
    return res.status(500).json({ status: false, message: "Server error" });
  }
});


router.get('/users', async (req, res) => {
  try {
    const user = await User.find();
    res.json(user);
  } catch (error) {
    console.error('Error fetching users data:', error);
    res.status(500).send('Server error');
  }
});

router.post('/signup', async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  try {
    let user = await User.findOne({ email });  
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      role: 'user', 
    });

    await user.save();
    const token = jwt.sign({ email: user.email }, process.env.KEY, { expiresIn: '60m' });

    console.log("Generated Token (Signup):", token);

    res.cookie('token', token, { httpOnly: true, maxAge: 60 * 60 * 1000 }); 

    return res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User is not registered" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Password is incorrect" });
    }

    user.loggedInAt = Date.now();
    await user.save();

    const token = jwt.sign({ email: user.email }, process.env.KEY, { expiresIn: '60m' });

    console.log("Generated Token (Signin):", token);

    res.cookie('token', token, { httpOnly: true, maxAge: 60 * 60 * 1000 });

    return res.json({ status: true, message: "Login successful", token });
  } catch (error) {
    console.error("Error signing in:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.KEY);
    const id = decoded.id;
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate({ _id: id }, { password: hashedPassword });
    return res.json({ status: true, message: "Updated password" });
  } catch (err) {
    return res.status(400).json({ status: false, message: "Invalid token" });
  }
});

router.get('/logout', (req, res) => {
  res.clearCookie('token')
  return res.json({status: true})
})

module.exports = router;
