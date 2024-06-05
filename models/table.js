const mongoose = require('mongoose')
const Cafe = require('./cafe')

const tableSchema = new mongoose.Schema({
  tableName: {
    type: String,
    required: true
  },
  quota: {
    type: Number,
    required: true
  },
  totalTablePrice: {
    type: Number,
    defualt: 0
  },
  cafe: {
    type: mongoose.Schema.ObjectId,
    ref: 'Cafe',
    required: true
  },
  tableInfo: {
    type: String,
    required: true
  },
  check: {
    type: mongoose.Schema.ObjectId,
    ref: 'Check'
  }
})

tableSchema.pre('save', async function () {
  try {
    // Find the user document and update its posts array with the new post
    await Cafe.findByIdAndUpdate(
      this.cafe,
      { $push: { tables: this._id } },
      { new: true }
    );

  } catch (err) {
    console.error(err);
  }
});

module.exports = mongoose.model('Table', tableSchema, 'table')