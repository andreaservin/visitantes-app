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
  // find document
  const { name } = request.query
  Visitor.find({ name: name })
    .then((res) => {
      if (res.length) {
        // update document
        const { count } = res[0]
        Visitor.updateOne(res[0], { count: count + 1 })
          .then(async () => {
            console.log('Update successfully...')
            // get all visitors
            const visitors = await Visitor.find()
            response.render('index', { visitors: visitors })
          })
          .catch((err) => console.log('ERROR when try to update: ', err))
      } else {
        // insert document
        Visitor.create({ name: name || 'Anónimo' })
          .then(async () => {
            console.log('Visitante agregado.')
            // get all visitors
            const visitors = await Visitor.find()
            response.render('index', { visitors: visitors })
          })
          .catch((err) => {
            console.log('ERROR al registrar: ', err)
          })
      }
    })
    .catch((err) => console.log('ERROR when try to find: ', err))

})

app.listen(3000, () => console.log('Listening on port 3000!'))
