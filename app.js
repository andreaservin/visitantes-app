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
app.get('/', (request, response) => {
  // find document
  const { name } = request.query
  Visitor.find({ name: name })
    .then((res) => {
      if (res.length) {
        // update document
        const { count } = res[0]
        Visitor.updateOne(res[0], { count: count + 1 })
          .then(() => console.log('Update successfully...'))
          .catch((err) => console.log('ERROR when try to update: ', err))
      } else {
        // insert document
        Visitor.create({ name: name || 'Anónimo' })
          .then(() => console.log('Visitante agregado.'))
          .catch((err) => {
            console.log('ERROR al registrar: ', err)
          })
      }
    })
    .catch((err) => console.log('ERROR when try to find: ', err))

  // get all visitors
  Visitor.find()
    .then((records) => {
      response.render('index', { visitors: records })
    })
    .catch((err) => console.log('ERROR when try to get all records: ', err))
})

app.listen(3000, () => console.log('Listening on port 3000!'))
