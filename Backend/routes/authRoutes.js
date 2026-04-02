const express = require('express');
const { login, signup, seedUsers, resetDatabase } = require('../controllers/authController');

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.post('/seed-users', seedUsers);
router.post('/reset-db', resetDatabase);

module.exports = router;