const mongoose = require('mongoose')
const Schema = mongoose.Schema

const categorySchema = new Schema({
  type: String,
  icon: String
})

module.exports = mongoose.model('Category', categorySchema)