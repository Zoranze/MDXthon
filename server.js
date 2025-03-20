const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json()); // To parse JSON data

// Connect to MongoDB
mongoose.connect('mongodb://username:password@host:port/database', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Could not connect to MongoDB:', err);
});

// Define a User Schema
const UserSchema = new mongoose.Schema({
  email: String,
  password: String
});

const User = mongoose.model('User', UserSchema);

// Handle User Registration
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ email, password: hashedPassword });
  await newUser.save();
  res.send('User registered');
});

// Start server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
