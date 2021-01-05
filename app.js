const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const Record = require('./models/Record')
const Category = require('./models/Category')
const port = 3000
require('./config/mongoose')
let icon = {}

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({ extended: true }))


app.get('/', async (req, res) => {
  const recordData = await Record.find().lean()
  const categoryData = await Category.find().lean()
  // Create icon object dynamic
  for (const categories of categoryData) {
    icon[categories.type] = categories.icon
  }
  let records = categoryData.map((item, i) => Object.assign({}, item, recordData[i]))
  const totalAmount = records.reduce((accumulator, record) => accumulator + record.amount, 0)
  for (const record of records) {
    record.icon = icon[record.category]
  }
  res.render('index', { records, totalAmount })

})

app.get('/records/new', (req, res) => {
  Category.find()
    .lean()
    .then(categories => res.render('new', { categories }))
})

app.post('/create', async (req, res) => {
  const newExpense = req.body
  console.log(icon)
  await Category.create({
    name: newExpense.name,
    type: newExpense.category,
    icon: icon[newExpense.category]
  })
  await Record.create(newExpense)
    .then(res.redirect('/'))
    .catch(err => console.log('Create Error'))
})

app.get('/records/:id/edit', async (req, res) => {
  const id = req.params.id
  await Record.findById(id)
    .lean()
    .then(records => {
      Category.find()
        .lean()
        .then(categories => res.render('edit', { records, categories }))
    })
})
app.post('/records/:id', async (req, res) => {
  const id = req.params.id
  const updated = req.body
  return Record.findById(id)
    .then(record => {
      record = Object.assign(record, updated)
      return record.save()
    }).then(res.redirect('/')).catch(err => console.log('Error'))
})


app.listen(port, () => {
  console.log(`Server now is running on localhost:${port}`)
})



