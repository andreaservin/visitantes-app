const express = require('express')
const app = express()
const mongoose = require('mongoose')

// database connection
mongoose.set('strictQuery', false)
mongoose.connect(
  process.env.MONGODB_URL || 'mongodb://localhost:27017/mongo-1',
  { useNewUrlParser: true }
)

mongoose.connection.on('connection', (e) => {
  console.log('Database connected successfully!')
})

mongoose.connection.on('error', (e) => {
  console.error(e)
})

// define a schema
var schema = mongoose.Schema({
  count: { type: Number, default: 1 },
  name: String,
})

// define model
var Visitor = mongoose.model('Visitor', schema)

// config views
app.set('view engine', 'pug')
app.set('views', 'views')
app.use(express.urlencoded())

// rutes
app.get('/', async (request, response) => {
  const { name } = request.query
  let visitor = {}
  if (name) {
    // find document
    visitor = await Visitor.findOne({ name: name })
    if (visitor) {
      // increment count
      visitor.count += 1
    } else {
      // create document
      visitor = new Visitor({ name: name })
    }
  } else {
    // create document
    visitor = new Visitor({ name: 'Anónimo' })
  }
  // save document
  await visitor.save()

  // get all visitors
  const visitors = await Visitor.find()
  response.render('index', { visitors: visitors })
})

app.listen(3000, () => console.log('Listening on port 3000!'))
