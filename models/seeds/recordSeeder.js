const Record = require('../Record')
const db = require('../../config/mongoose')


db.once('open', async () => {
  const records = require('./data.json').record
  console.log('mongoDB connected')
  for (const item of records) {
    await Record.create({
      name: item.name,
      category: item.category,
      amount: item.amount,
      date: item.date
    }).then(() => console.log('seed build successfully'))
      .catch(err => console.log(`something went wrong${err}`))
  }
  console.log('mongoDB done')
  return db.close()
})
