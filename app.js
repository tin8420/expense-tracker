const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const Record = require('./models/Record')
const Category = require('./models/Category')

const port = 3000

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({ extended: true }))


app.get('/', (req, res) => {
  Record
    .find()
    .lean()
    .then(records => res.render('index', { records }))
    .catch(err => console.log(err))

})

app.listen(port, () => {
  console.log(`Server now is running on localhost:${port}`)
})

