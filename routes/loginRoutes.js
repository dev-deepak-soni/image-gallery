const express = require('express');
const loginController = require('../controller/loginController');
const multer = require('multer');
const router = express.Router();
const upload = multer();

router.post('/login', upload.none(), loginController.login);
router.post('/signup', upload.none(), loginController.signup);
router.get('/loginWithGoogle', loginController.loginWithGoogle);

module.exports = router;
