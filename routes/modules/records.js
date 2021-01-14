const express = require('express')
const router = express.Router()
const Record = require('../../models/Record')
const Category = require('../../models/Category')



router.get('/new', (req, res) => {
  Category.find()
    .lean()
    .then(categories => res.render('new', { categories }))
})

router.post('/new', (req, res) => {
  const newExpense = req.body
  Record.create(newExpense)
    .then(res.redirect('/'))
    .catch(err => console.log('Create Error'))
})


router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  Record.findById(id)
    .lean()
    .then(records => {
      Category.find()
        .lean()
        .then(categories => res.render('edit', { records, categories }))
    })
})
router.put('/:id', (req, res) => {
  const id = req.params.id
  const updated = req.body
  Record.findById(id)
    .then(record => {
      record = Object.assign(record, updated)
      return record.save()
    }).then(res.redirect('/')).catch(err => console.log('Error'))
})

router.delete('/:id/delete', (req, res) => {
  const id = req.params.id
  Record.findById(id)
    .then(record => record.remove())
    .then(res.redirect('/'))
    .catch(err => console.error(err))
})

module.exports = router