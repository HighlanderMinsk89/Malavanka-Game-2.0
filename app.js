const express = require('express')
const http = require('http')
const config = require('config')
const mongoose = require('mongoose')
const socket = require('socket.io')

const app = express()
const httpServer = http.createServer(app)
const io = socket(httpServer)

app.use(express.json({ extended: true }))

app.use('/api/auth', require('./routes/auth.routes'))

// if (process.env.NODE_ENV === "production") {
//   app.use("/", express.static(path.join(__dirname, "client", "build")));

//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
//   });
// }

const PORT = config.get('port') || 5000
const httpPORT = config.get('httpPORT') || 8000

async function start() {
  try {
    await mongoose.connect(config.get('mongoUri'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    app.listen(PORT, () => console.log(`App has been started on port ${PORT}`))
    httpServer.listen(httpPORT, () =>
      console.log(`Http server is running on ${httpPORT}`)
    )
  } catch (e) {
    console.log('Server error', e.message)
    process.exit(1)
  }
}

start()
