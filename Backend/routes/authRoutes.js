const express = require('express');
const { login, seedUsers } = require('../controllers/authController');

const router = express.Router();

router.post('/login', login);
router.post('/seed-users', seedUsers);

module.exports = router;