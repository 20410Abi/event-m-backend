const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    pricing: {
        free: { type: Number, required: true, default: 0, min: 0 },
        advanced: { type: Number, required: true, default: 0, min: 0 },
        pro: { type: Number, required: true, default: 0, min: 0 }
    }
});

module.exports = mongoose.model('Event', eventSchema);
