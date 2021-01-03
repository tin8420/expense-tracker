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
  console.log(totalAmount)
})
app.get('/new', (req, res) => {
  res.render('/new')

})
app.listen(port, () => {
  console.log(`Server now is running on localhost:${port}`)
})



