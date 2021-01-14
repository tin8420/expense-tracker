const express = require('express')
const router = express.Router()
const Record = require('../../models/Record')
const Category = require('../../models/Category')
const to = require('await-to-js').default


router.get('/', async (req, res) => {
  try {
    let recordData = await Record.find().lean()
    const categoryData = await Category.find().lean()
    let filter = req.query.category
    let icon = {}
    let totalAmount = recordData.reduce((accumulator, record) => accumulator + record.amount, 0)

    if (filter) {
      recordData = recordData.filter(record => record.category === filter)
      totalAmount = recordData.reduce((accumulator, record) => accumulator + record.amount, 0)
    }
    // Create icon object dynamic
    for (const categories of categoryData) {
      icon[categories.type] = categories.icon
    }
    // Change category with icon
    for (const record of recordData) {
      record.category = icon[record.category]
    }
    res.render('index', { recordData, categoryData, totalAmount, filter })
  } catch (error) {
    console.log(error)
  }

})

module.exports = router