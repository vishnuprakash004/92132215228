const mongoose = require('mongoose');

const clickSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    ipAddress: { type: String },
    referrer: { type: String },
    // In a real app, you might use an API to resolve IP to a location.
    // For this test, 'Unknown' is sufficient.
    location: { type: String, default: 'Unknown' } 
}, {_id: false});

const urlSchema = new mongoose.Schema({
    shortCode: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    originalUrl: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        required: true
    },
    clicks: [clickSchema],
    clickCount: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Url', urlSchema);