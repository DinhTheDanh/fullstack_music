const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/spotify_data_dev', {});
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log('Connected to MongoDB error');
    }
}

module.exports = { connect };
