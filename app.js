const express = require('express')
const http = require('http')
const config = require('config')
const mongoose = require('mongoose')
const socket = require('socket.io')
const socketConsumer = require('./socket')

const app = express()
const httpServer = http.createServer(app)
const io = socket(httpServer)

app.use(express.json({ extended: true }))

app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/room', require('./routes/room.routes'))
app.use('/api/word', require('./routes/word.routes'))

// if (process.env.NODE_ENV === "production") {
//   app.use("/", express.static(path.join(__dirname, "client", "build")));

//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
//   });
// }

const httpPORT = config.get('httpPORT') || 5000

socketConsumer.start(io)

async function start() {
  try {
    await mongoose.connect(config.get('mongoUri'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    httpServer.listen(httpPORT, () =>
      console.log(`Http server is running on ${httpPORT}`)
    )
  } catch (e) {
    console.log('Server error', e.message)
    process.exit(1)
  }
}

start()

module.exports = httpServer
