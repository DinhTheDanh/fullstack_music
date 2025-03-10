const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypts = require('bcrypt');
const SECRET_KEY = 'abc';
const SALT_ROUND = 10;

const User = new Schema({
    username: { type: String, required: false },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});
User.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypts.hash(this.password, SALT_ROUND);
    }
    next();
});
module.exports = mongoose.model('User', User);
