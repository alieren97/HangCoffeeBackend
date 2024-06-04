const mongoose = require('mongoose');


const {
    MONGO_IP,
    MONGO_PASSWORD,
    MONGO_PORTS,
    MONGO_USER,
    MONGO_DB_URI,
} = require("./configs");
const mongoUrl = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORTS}/?authSource=admin`;


const connectDatabase = async () => {
    try {
        await mongoose.connect(MONGO_DB_URI, {});
        console.log(`DATABASE: Connected to database successfully`);
    } catch (error) {
        console.error('DATABASE: Could not connect to database:', error.message);
        setTimeout(connectDatabase, 5000)
    }
}

module.exports = connectDatabase;