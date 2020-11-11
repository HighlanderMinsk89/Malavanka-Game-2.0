const roomsAndUsers = {}

module.exports = {
  start: (io) => {
    io.on('connection', (socket) => {
      socket.on('getId', () => {
        socket.emit('your id', socket.id)
      })

      socket.on('userJoined', ({ userName, location, roomid, socketId }) => {
        socket.join(roomid)
        socket.roomJoined = roomid
        socket.emit('welcomeMessage', 'Welcome to the chat')

        const newSocketUser = { [socketId]: { userName, location } }
        if (!roomsAndUsers[roomid]) {
          roomsAndUsers[roomid] = [newSocketUser]
        } else {
          roomsAndUsers[roomid].push(newSocketUser)
        }

        socket.broadcast
          .to(roomid)
          .emit('userJoinedMessage', `${userName} has joined the chat`)

        io.to(roomid).emit(
          'usersRoomUpdate',
          getUsersInRoom(roomsAndUsers, roomid)
        )
      })

      socket.on('getRoomCapacity', () => {
        socket.emit('roomsAndUsers', roomsAndUsers)
      })

      socket.on('send message', (body) => {
        io.to(body.roomid).emit('message', body)
      })

      // socket.on('getRoomUsers', (roomid) => {
      //   const users = getUsersInRoom(roomsAndUsers, roomid)
      //   console.log('users', users)
      //   socket.emit('usersInRoom', users)
      // })

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

      socket.on('colorChange', ({ newColor, roomid }) => {
        socket.broadcast.to(roomid).emit('colorChangeCli', { newColor })
      })

      socket.on('lineChange', ({ newLine, roomid }) => {
        socket.broadcast.to(roomid).emit('lineChangeCli', { newLine })
      })

      socket.on('clearCanvas', ({ roomid }) => {
        socket.broadcast.to(roomid).emit('clearCanvasCli')
      })

      //

      socket.on('leftRoom', ({ roomid }) => {
        socket.roomJoined = null
        socket.leave(roomid, () => {
          if (roomsAndUsers[roomid]) {
            onSocketLeavesRoomOrDisconnect(socket.id, roomid, roomsAndUsers)
            io.to(roomid).emit(
              'usersRoomUpdate',
              getUsersInRoom(roomsAndUsers, roomid)
            )
          }
        })
      })

      socket.on('disconnect', () => {
        if (socket.roomJoined) {
          onSocketLeavesRoomOrDisconnect(
            socket.id,
            socket.roomJoined,
            roomsAndUsers
          )
          io.to(socket.roomJoined).emit(
            'usersRoomUpdate',
            getUsersInRoom(roomsAndUsers, socket.roomJoined)
          )
          socket.roomJoined = null
        }
      })
    })
  },
}

function onSocketLeavesRoomOrDisconnect(socketId, room, roomsAndUsersObj) {
  if (roomsAndUsers[room]) {
    roomsAndUsersObj[room] = roomsAndUsersObj[room].filter((user) => {
      return Object.keys(user)[0] !== socketId
    })
  }
}

function getUsersInRoom(roomsAndUsersObj, room) {
  if (roomsAndUsers[room]) {
    return roomsAndUsersObj[room].map((socket) => Object.values(socket)[0])
  }
}
