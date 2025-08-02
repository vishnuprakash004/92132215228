const express = require('express');
const { redirectToOriginalUrl } = require('../controllers/url.controller');
const router = express.Router();

router.get('/:shortCode', redirectToOriginalUrl);

module.exports = router;