const express = require('express')
const router = express.Router()
const Record = require('../../models/Record')
const Category = require('../../models/Category')
let icon = {}


router.get('/new', (req, res) => {
  Category.find()
    .lean()
    .then(categories => res.render('new', { categories }))
})

router.post('/new', async (req, res) => {
  const newExpense = req.body
  await Record.create(newExpense)
    .then(res.redirect('/'))
    .catch(err => console.log('Create Error'))
})


router.get('/:id/edit', async (req, res) => {
  const id = req.params.id
  await Record.findById(id)
    .lean()
    .then(records => {
      Category.find()
        .lean()
        .then(categories => res.render('edit', { records, categories }))
    })
})
router.put('/:id', async (req, res) => {
  const id = req.params.id
  const updated = req.body
  Record.findById(id)
    .then(record => {
      record = Object.assign(record, updated)
      return record.save()
    }).then(res.redirect('/')).catch(err => console.log('Error'))
})

router.delete('/:id/delete', async (req, res) => {
  const id = req.params.id
  await Record.findById(id)
    .then(record => record.remove())
    .then(res.redirect('/'))
    .catch(err => console.error(err))
})

router.get('/filter', async (req, res) => {
  let recordData = await Record.find().lean()
  const categoryData = await Category.find().lean()
  const filter = req.query
  recordData = recordData.filter(record => record.category === filter.category)
  const totalAmount = recordData.reduce((accumulator, record) => accumulator + record.amount, 0)
  for (const categories of categoryData) {
    icon[categories.type] = categories.icon
  }
  for (const record of recordData) {
    record.category = icon[record.category]
  }
  res.render('index', { recordData, categoryData, totalAmount })
})

module.exports = router