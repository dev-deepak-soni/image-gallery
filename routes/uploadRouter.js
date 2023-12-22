const express = require('express');
const uploadController = require('../controller/uploadController');
const { middleware } = require('../helper/authentication');
const { uploadFiles } = require('../helper/multipart');

const router = express.Router();

router.post('/upload', middleware, uploadFiles('./public/upload').single('image'), uploadController.upload);
router.get('/showFiles', middleware , uploadController.showFiles);

module.exports = router;
