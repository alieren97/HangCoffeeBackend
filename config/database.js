const mongoose = require('mongoose');


const connectDatabase = async (db_url) => {
    try {
        await mongoose.connect(db_url, {});
        console.log(`DATABASE: Connected to database successfully: ${db_url}`);
    } catch (error) {
        console.error('DATABASE: Could not connect to database:', error.message);
    }
}

module.exports = connectDatabase;