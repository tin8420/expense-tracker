const Category = require('../Category')
const db = require('../../config/mongoose')

db.once('open', async () => {
  const categories = require('./data.json').category
  console.log('mongoDB connected')
  for (const item of categories) {
    await Category.create({
      name: item.name,
      icon: item.icon
    }).then(() => console.log('seed build successfully'))
      .catch(err => console.log(`something went wrong${err}`))
  }
  console.log('mongoDB done')
  return db.close()
})

