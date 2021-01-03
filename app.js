const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const Record = require('./models/Record')
const Category = require('./models/Category')
const port = 3000
require('./config/mongoose')


app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({ extended: true }))


app.get('/', async (req, res) => {
  const recordData = await Record.find().lean()
  const categoryData = await Category.find().lean()
  let records = recordData.map((item, i) => Object.assign({}, item, categoryData[i]))
  const totalAmount = records.reduce((accumulator, record) => accumulator + record.amount, 0)

  res.render('index', { records: records, totalAmount: totalAmount })
  // accumulator累加器初始值為0
  // record為當前陣列索引值
})
app.get('/records/new', (req, res) => {
  res.render('new')
})

app.post('/create', async (req, res) => {
  const newExpense = req.body
  const icon = {
    家庭支出: 'fas fa-home',
    交通費: 'fas fa-shuttle-van',
    娛樂費: 'fas fa-grin-beam',
    飲食費: 'fas fa-utensils',
    其他支出: 'fas fa-pen'
  }
  await Category.create({
    name: newExpense.name,
    icon: icon[newExpense.category]
  })
  await Record.create({
    name: newExpense.name,
    amount: newExpense.amount,
    date: newExpense.date,
  }).then(res.redirect('/')).catch(err => console.log('Create Error'))

})

app.listen(port, () => {
  console.log(`Server now is running on localhost:${port}`)
})



