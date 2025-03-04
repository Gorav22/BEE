const mongoose = require('mongoose');
require('dotenv').config()
mongoose.connect(process.env.MONGODB_URL)
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

module.exports = mongoose.model('User', userSchema);
