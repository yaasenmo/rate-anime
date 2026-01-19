# Backend Code - Line by Line Explanation

## server.js - Main Entry Point

```javascript
const express = require('express');
// Import Express framework - helps create web server easily

const cors = require('cors');
// CORS = Cross-Origin Resource Sharing
// Allows frontend (localhost:3000) to talk to backend (localhost:5000)

const dotenv = require('dotenv');
// Loads secret variables from .env file

const path = require('path');
// Node.js module for working with file paths

const connectDB = require('./config/db');
// Our database connection function

const errorHandler = require('./middleware/errorHandler');
// Custom error handling

dotenv.config();
// Read .env file, now we can use process.env.PORT etc.

connectDB();
// Connect to MongoDB database

const app = express();
// Create Express application

app.use(cors());
// Enable CORS for all routes

app.use(express.json());
// Parse JSON in request bodies
// Without this, req.body would be undefined

app.use('/uploads', express.static(path.join(__dirname, '../Anime, photos')));
// Serve image files from 'Anime, photos' folder
// localhost:5000/uploads/naruto.png → serves Anime, photos/naruto.png

// Import and mount routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
// Routes in authRoutes.js get prefix /api/auth
// So '/login' becomes '/api/auth/login'

// Similar for other routes...
app.use('/api/anime', require('./routes/animeRoutes'));
app.use('/api/comments', require('./routes/commentRoutes'));
app.use('/api/ratings', require('./routes/ratingRoutes'));

app.use(errorHandler);
// Error handler must be LAST - catches all errors

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// Start server on port 5000
```

---

## config/db.js - Database Connection

```javascript
const mongoose = require('mongoose');
// Mongoose = ODM (Object Document Mapper) for MongoDB

const connectDB = async () => {
  // async because database connection takes time
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    // Connect using URI from .env file
    // await = wait for connection to complete
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);  // Exit app if can't connect
  }
};

module.exports = connectDB;
```

---

## models/User.js - User Schema

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');  // For hashing passwords
const jwt = require('jsonwebtoken'); // For auth tokens

const UserSchema = new mongoose.Schema({
  // Schema = blueprint for data structure
  
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: true,      // No duplicates
    trim: true,        // Remove whitespace
    minlength: 3,
    maxlength: 30
  },
  
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email']
    // Regex pattern to validate email format
  },
  
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false  // Don't return password in queries by default
  },
  
  savedAnime: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Anime'
    // Array of references to Anime documents
  }],
  
  isGuest: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// MIDDLEWARE - runs BEFORE saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();  // Skip if password not changed
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  // Hash password before saving
  // "password123" → "$2a$10$X7jK..."
});

// METHOD - create JWT token
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this._id },           // Data in token
    process.env.JWT_SECRET,     // Secret key
    { expiresIn: '7d' }         // Expires in 7 days
  );
};

// METHOD - compare passwords
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
  // Returns true if match, false otherwise
};

module.exports = mongoose.model('User', UserSchema);
```

---

## models/Anime.js - Anime Schema

```javascript
const mongoose = require('mongoose');

const AnimeSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true, maxlength: 500 },
  image: { type: String, required: true },  // Filename like 'naruto.png'
  genre: [{ type: String }],  // Array: ['Action', 'Adventure']
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
    // Array of User IDs who liked this
  }],
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  totalRatings: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Anime', AnimeSchema);
```

---

## middleware/auth.js - Protects Routes

```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  // Format: "Bearer eyJhbGciOiJIUzI1NiIs..."
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, error: 'Not authorized' });
  }

  try {
    // Verify token is valid
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user to request
    req.user = await User.findById(decoded.id);
    
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'User not found' });
    }
    
    next();  // Continue to route handler
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Not authorized' });
  }
};
```

---

## controllers/authController.js - Auth Logic

```javascript
const User = require('../models/User');

// REGISTER
exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    // Destructure data from request body
    
    const user = await User.create({ username, email, password });
    // Create user (password auto-hashed by middleware)
    
    const token = user.getSignedJwtToken();
    // Generate JWT token
    
    res.status(201).json({ success: true, token, user: { id: user._id, username: user.username } });
  } catch (err) {
    next(err);  // Pass to error handler
  }
};

// LOGIN
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email }).select('+password');
    // .select('+password') includes password field
    
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    
    const isMatch = await user.matchPassword(password);
    
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    
    const token = user.getSignedJwtToken();
    res.status(200).json({ success: true, token, user: { id: user._id, username: user.username } });
  } catch (err) {
    next(err);
  }
};
```

---

## controllers/animeController.js - Anime Logic

```javascript
const Anime = require('../models/Anime');

// GET ALL ANIME
exports.getAllAnime = async (req, res, next) => {
  try {
    const { search } = req.query;
    // Get query params: /api/anime?search=naruto
    
    let query = {};
    if (search) {
      query.title = { $regex: search, $options: 'i' };
      // MongoDB regex search, case-insensitive
    }
    
    const anime = await Anime.find(query).sort({ createdAt: -1 });
    // Find matching anime, newest first
    
    res.status(200).json({ success: true, count: anime.length, data: anime });
  } catch (err) {
    next(err);
  }
};

// LIKE ANIME
exports.likeAnime = async (req, res, next) => {
  try {
    const anime = await Anime.findById(req.params.id);
    
    const likeIndex = anime.likes.indexOf(req.user.id);
    // Check if user already liked
    
    if (likeIndex > -1) {
      anime.likes.splice(likeIndex, 1);  // Unlike
    } else {
      anime.likes.push(req.user.id);     // Like
    }
    
    await anime.save();
    res.status(200).json({ success: true, data: anime, liked: likeIndex === -1 });
  } catch (err) {
    next(err);
  }
};
```

---

## seed.js - Populate Database

```javascript
const mongoose = require('mongoose');
const Anime = require('./models/Anime');
require('dotenv').config();

const animeData = [
  {
    title: 'Naruto',
    description: 'A young ninja seeks recognition...',
    image: 'naruto.png',  // Matches file in Anime, photos folder
    genre: ['Action', 'Adventure']
  },
  // ... more anime
];

const seedDatabase = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  await Anime.deleteMany({});        // Clear existing
  await Anime.insertMany(animeData); // Insert new
  console.log('Database seeded!');
  process.exit(0);
};

seedDatabase();
```
