const roomsCapacity = {}

module.exports = {
  start: (io) => {
    io.on('connection', (socket) => {
      socket.on('getId', () => {
        socket.emit('your id', socket.id)
      })

      socket.on('userJoined', ({ userName, location, roomid }) => {
        socket.join(roomid)
        socket.emit('welcomeMessage', 'Welcome to the chat')
        console.log('USER JOINED', userName, roomid)
        socket.room = roomid
        roomsCapacity[roomid] === undefined
          ? (roomsCapacity[roomid] = 1)
          : roomsCapacity[roomid]++
        console.log('roomsCapacity', roomsCapacity)

        socket.broadcast
          .to(roomid)
          .emit('userJoinedMessage', `${userName} has joined the chat`)
      })

      socket.on('getRoomCapacity', () => {
        socket.emit('roomsCapacity', roomsCapacity)
      })

      socket.on('send message', (body) => {
        io.to(body.roomid).emit('message', body)
      })

      //drawing
      socket.on('startDrawing', ({ offsetX, offsetY, roomid }) => {
        socket.broadcast
          .to(roomid)
          .emit('startDrawingCli', { offsetY, offsetX })
      })

      socket.on('finishDrawing', ({ roomid }) => {
        socket.broadcast.to(roomid).emit('finishDrawingCli')
      })

      socket.on('draw', ({ roomid, offsetX, offsetY }) => {
        socket.broadcast.to(roomid).emit('drawCli', { offsetX, offsetY })
      })

      //

      socket.on('disconnect', () => {
        roomsCapacity[socket.room]--
        console.log('user has left the room -->', socket.room)
        console.log(roomsCapacity)
        io.emit('message', 'User has left the chat')
      })
    })
  },
}
