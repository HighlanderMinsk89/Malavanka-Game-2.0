const roomsCapacity = {}
module.exports = {
  start: (io) => {
    io.on('connection', (socket) => {
      socket.emit('your id', socket.id)
      socket.emit('welcomeMessage', 'Welcome to the chat')

      socket.on('userJoined', ({ userName, location, roomid }) => {
        socket.join(roomid)
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

      socket.on('disconnect', () => {
        roomsCapacity[socket.room]--
        console.log('user has left the room -->', socket.room)
        console.log(roomsCapacity)
        io.emit('message', 'User has left the chat')
      })
    })
  },
}
