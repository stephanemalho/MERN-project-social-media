const router = require('express').Router(); //call express router
const authController = require('../controllers/auth.controller');

router.post('/register', authController.signUp);

module.exports = router;