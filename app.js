const express = require('express')
const app = express()
const mongoose = require('mongoose')

// database connection
mongoose.connect(
  process.env.MONGODB_URL || 'mongodb://localhost:27017/mongo-1',
  { useNewUrlParser: true }
)

mongoose.connection.on('error', function (e) {
  console.error(e)
})

// define a schema
var schema = mongoose.Schema({
  date: { type: Date, default: Date.now() },
  name: String,
})

// define model
var Visitor = mongoose.model('Visitor', schema)

// rutes
app.get('/', (req, res) => {
  // insert document
  Visitor.create({ date:Date.now(), name: req.query.name || 'Anónimo' })
    .then(() => res.send(`<h1>El visitante fue almacenado con éxito</h1>`))
    .catch((err) => {
      console.log(err)
      res.send(`<h1>Ocurrió un error al almacenar el visitante...</h1>`)
    })
})

app.listen(3000, () => console.log('Listening on port 3000!'))
