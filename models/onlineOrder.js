const mongoose = require('mongoose')

const onlineOrderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('OnlineOrder', onlineOrderSchema, 'onlineorder')