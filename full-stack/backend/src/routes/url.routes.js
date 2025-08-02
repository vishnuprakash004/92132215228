const express = require('express');
const { createShortUrl, getUrlStatistics, getAllUrls } = require('../controllers/url.controller');
const router = express.Router();

router.post('/', createShortUrl);
router.get('/', getAllUrls); // For the stats page list
router.get('/:shortCode', getUrlStatistics);

module.exports = router;