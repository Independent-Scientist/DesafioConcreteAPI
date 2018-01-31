// Set up the Express.js listening port
const port = process.env.PORT || 8081

// URL of the running mongodb instance
const mongo = process.env.MONGO || 'mongodb://mongo/concrete-desafio'

// mongodb driver
const mongoose = require('mongoose')
mongoose.Promise = global.Promise

// Express app
const app = require('./app')

// Connect to Database
mongoose
.connect(mongo, {useMongoClient: true})
.then(() => {
  // Start HTTP server.
  app.listen(port, '0.0.0.0', () => {
    console.log('Listening port: ' + port)
  })
})
.catch(e => {
  console.log(e)
})
