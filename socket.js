module.exports = {
  start: (io) => {
    io.on('connection', (socket) => {
      socket.emit('your id', socket.id)
      socket.on('send message', (body) => {
        io.emit('message', body)
      })
    })
  },
}
