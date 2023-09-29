const mongoose = require('mongoose')

const connectDb = async () => {
  const connectionParams = { useNewUrlParser: true }
  mongoose.connect(process.env.CONNECTION_STRING, connectionParams)

  mongoose.connection.on('connected', () => {
    console.log(
      'Connected to database:',
      mongoose.connection.host,
      mongoose.connection.name
    )
  })

  mongoose.connection.on('error', (err) => {
    console.log('Error while connecting to database:' + err)
  })

  mongoose.connection.on('disconnected', () => {
    console.log('Mongodb connection disconnected')
  })
}

module.exports = connectDb
