const mongoose = require('mongoose')
const Schema = mongoose.Schema

const recordSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  category: String,
  amount: Number,
  date: Date,
})

module.exports = mongoose.model('Record', recordSchema)
