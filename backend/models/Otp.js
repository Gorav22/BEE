const mongoose = require('mongoose');
require('dotenv').config()
mongoose.connect(process.env.MONGODB_URL)
const otpSchema = new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true }
});

module.exports = mongoose.model('Otp', otpSchema);
