const mongoose = require('mongoose');

const connectDatabase = (db_url) => {
    mongoose.set('strictQuery', true)
    mongoose.connect(db_url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(con => {
        console.log(db_url)
        console.log(`MongoDB Database with host: ${con.connection.host}`)
    });
};

module.exports = connectDatabase;