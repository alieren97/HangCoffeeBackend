const mongoose = require('mongoose');
const {
    MONGO_IP,
    MONGO_PASSWORD,
    MONGO_PORTS,
    MONGO_USER,
} = require("./configs");
const mongoUrl = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORTS}/?authSource=admin`;

const connectDatabase = async () => {
    try {
        await mongoose.connect(mongoUrl, {});
        console.log(`DATABASE: Connected to database successfully: ${mongoUrl}`);
    } catch (error) {
        console.error('DATABASE: Could not connect to database:', error.message);
        setTimeout(connectDatabase, 5000)
    }
}

module.exports = connectDatabase;