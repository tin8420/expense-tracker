const handlebars = require('handlebars')

const helper = handlebars.registerHelper('filter', function (category, type, options) {
  if (category === type) {
    return options.fn(this)
  } else {
    return options.inverse(this)
  }
})

module.export = helper