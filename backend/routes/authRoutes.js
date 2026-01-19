const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { register, login, guestLogin, getMe, logout } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post(
  '/register',
  [
    body('username').trim().isLength({ min: 3, max: 30 }).withMessage('Username must be 3-30 characters'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').exists().withMessage('Password is required')
  ],
  login
);

router.post('/guest', guestLogin);

router.get('/me', protect, getMe);

router.post('/logout', protect, logout);

module.exports = router;
