const express = require('express')
const router = express.Router()
const Record = require('../../models/Record')
const Category = require('../../models/Category')
let icon = {}

router.get('/', async (req, res) => {
  const recordData = await Record.find().lean()
  const categoryData = await Category.find().lean()
  const totalAmount = recordData.reduce((accumulator, record) => accumulator + record.amount, 0)
  // Create icon object dynamic
  for (const categories of categoryData) {
    icon[categories.type] = categories.icon
  }
  for (const record of recordData) {
    record.category = icon[record.category]
  }
  res.render('index', { recordData, categoryData, totalAmount })
})

module.exports = router