const Url = require('../models/url.model');
const { nanoid } = require('nanoid');
const logger = require('../middleware/logger');

// --- Helper Function for URL Validation ---
const isValidUrl = (urlString) => {
    try {
        const url = new URL(urlString);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (e) {
        return false;
    }
};

// --- Controller for POST /shorturls ---
const createShortUrl = async (req, res, next) => {
    const { url: originalUrl, validity, shortcode } = req.body;

    if (!originalUrl || !isValidUrl(originalUrl)) {
        return res.status(400).json({ message: 'A valid URL must be provided.' });
    }

    try {
        let code = shortcode;
        if (code) {
            // User provided a custom shortcode
            const existing = await Url.findOne({ shortCode: code });
            if (existing) {
                logger.warn(`Shortcode collision for custom code: ${code}`);
                return res.status(409).json({ message: 'This shortcode is already in use.' });
            }
        } else {
            // Generate a unique shortcode
            code = nanoid(7);
            let existing = await Url.findOne({ shortCode: code });
            while (existing) {
                code = nanoid(7);
                existing = await Url.findOne({ shortCode: code });
            }
        }

        const validityInMinutes = parseInt(validity, 10) || 30; // Default to 30 minutes
        const expiresAt = new Date(Date.now() + validityInMinutes * 60 * 1000);

        const newUrl = new Url({
            originalUrl,
            shortCode: code,
            expiresAt,
        });

        await newUrl.save();
        logger.info(`New URL created. Shortcode: ${code}, Original: ${originalUrl}`);

        res.status(201).json({
            shortLink: `${process.env.BASE_URL}/${code}`,
            expiry: expiresAt.toISOString(),
        });

    } catch (error) {
        next(error);
    }
};

// --- Controller for GET /shorturls/:shortCode ---
const getUrlStatistics = async (req, res, next) => {
    try {
        const { shortCode } = req.params;
        const url = await Url.findOne({ shortCode });

        if (!url) {
            return res.status(404).json({ message: 'Shortcode not found.' });
        }

        res.status(200).json({
            originalUrl: url.originalUrl,
            createdAt: url.createdAt.toISOString(),
            expiryDate: url.expiresAt.toISOString(),
            totalClicks: url.clickCount,
            clickDetails: url.clicks,
        });
    } catch (error) {
        next(error);
    }
};

// --- Controller for GET /shorturls (List all) ---
const getAllUrls = async (req, res, next) => {
    try {
        const urls = await Url.find({}).sort({ createdAt: -1 });
        res.status(200).json(urls);
    } catch (error) {
        next(error);
    }
};


// --- Controller for GET /:shortCode (Redirection) ---
const redirectToOriginalUrl = async (req, res, next) => {
    try {
        const { shortCode } = req.params;
        const url = await Url.findOne({ shortCode });

        if (!url) {
            return res.status(404).json({ message: 'This link does not exist.' });
        }

        if (url.expiresAt < new Date()) {
            logger.warn(`Attempted to access expired link: ${shortCode}`);
            return res.status(410).json({ message: 'This link has expired.' });
        }
        
        // Log the click for analytics
        url.clickCount++;
        url.clicks.push({
            ipAddress: req.ip,
            referrer: req.get('Referrer') || 'Direct',
        });
        await url.save();
        
        logger.info(`Redirecting ${shortCode} to ${url.originalUrl}`);
        return res.redirect(302, url.originalUrl);

    } catch (error) {
        next(error);
    }
};

module.exports = {
    createShortUrl,
    getUrlStatistics,
    redirectToOriginalUrl,
    getAllUrls
};