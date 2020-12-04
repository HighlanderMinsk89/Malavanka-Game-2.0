const { roomsAndUsers, createGame } = require('./game-module/game')

const socketForGame = (io, socket) => {
  // socket.on('userJoined', ({ roomid }) => {
  //   io.to(roomid).emit('gameStateUpdate', roomsAndUsers[roomid])
  // })

  socket.on('wordSelected', ({ selectedWord, roomid }) => {
    if (roomsAndUsers[roomid]) {
      roomsAndUsers[roomid].word = selectedWord
      roomsAndUsers[roomid].roundTimer = 30
      io.to(roomid).emit('gameStateUpdate', roomsAndUsers[roomid])
      socket.emit('clearCanvasBeforeGame')
    }
  })

  socket.on('playerSkippedDrawing', (roomid) => {
    if (roomsAndUsers[roomid]) {
      roomsAndUsers[roomid].nextPlayer(true)
      io.to(roomid).emit('gameStateUpdate', roomsAndUsers[roomid])
      io.to(roomid).emit(
        'usersRoomUpdate',
        getUsersInRoom(roomsAndUsers, roomid)
      )
      socket.emit('clearCanvasBeforeGame')
    }
  })

  socket.on('nextRound', ({ roomid, round }) => {
    if (roomsAndUsers[roomid]) {
      roomsAndUsers[roomid].nextRound(round)
      io.to(roomid).emit('gameStateUpdate', roomsAndUsers[roomid])
      io.to(roomid).emit(
        'usersRoomUpdate',
        getUsersInRoom(roomsAndUsers, roomid)
      )
      socket.emit('clearCanvasBeforeGame')
    }
  })
  socket.on('newGame', (roomid) => {
    if (roomsAndUsers[roomid]) {
      roomsAndUsers[roomid].startNewGame()
      io.to(roomid).emit('gameStateUpdate', roomsAndUsers[roomid])
      io.to(roomid).emit(
        'usersRoomUpdate',
        getUsersInRoom(roomsAndUsers, roomid)
      )
    }
  })
  socket.on('drawFinishedNextPlayer', (roomid) => {
    if (roomsAndUsers[roomid]) {
      roomsAndUsers[roomid].nextPlayer(false)
      io.to(roomid).emit('gameStateUpdate', roomsAndUsers[roomid])
      io.to(roomid).emit(
        'usersRoomUpdate',
        getUsersInRoom(roomsAndUsers, roomid)
      )
      socket.emit('clearCanvasBeforeGame')
    }
  })

  socket.on('roundTimer', ({ roomid }) => {
    if (roomsAndUsers[roomid]) {
      roomsAndUsers[roomid].setRoundTimer()
      io.to(roomid).emit('roundTimerUpdate', roomsAndUsers[roomid].roundTimer)
    }
  })

  socket.on('wordMatch', ({ roomid, socketId }) => {
    if (roomsAndUsers[roomid]) {
      roomsAndUsers[roomid].calcPointsForUserOnMatch(socketId)
      io.to(roomid).emit('gameStateUpdate', roomsAndUsers[roomid])
      io.to(roomid).emit(
        'usersRoomUpdate',
        getUsersInRoom(roomsAndUsers, roomid)
      )
    }
  })
}

const socketForChat = (io, socket) => {
  socket.on('userJoined', ({ userName, location, roomid, socketId }) => {
    socket.join(roomid)
    socket.roomJoined = roomid

    const newSocketUser = {
      [socketId]: {
        userName,
        location,
        isTurnToDraw: false,
        points: 0,
        roundPoints: 0,
        match: false,
      },
    }
    if (!roomsAndUsers[roomid]) {
      roomsAndUsers[roomid] = createGame(roomid, newSocketUser)
    } else {
      roomsAndUsers[roomid].addUser(newSocketUser)
    }

    io.to(roomid).emit('gameStateUpdate', roomsAndUsers[roomid])

    if (roomsAndUsers[roomid].users.length === 2) {
      socket.emit('clearCanvasBeforeGame')
    }

    socket.emit('welcomeMessage', 'Welcome to the chat')
    socket.broadcast
      .to(roomid)
      .emit('userJoinedMessage', `${userName} has joined the chat`)

    io.to(roomid).emit('usersRoomUpdate', getUsersInRoom(roomsAndUsers, roomid))
    io.emit('allRoomsQtyUpdate', roomsAndUsers)
  })

  socket.on('getRoomCapacity', () => {
    socket.emit('roomsAndUsers', roomsAndUsers)
  })

  socket.on('send message', (body) => {
    io.to(body.roomid).emit('message', body)
  })
}

const socketForDrawing = (socket) => {
  socket.on('startDrawing', ({ offsetX, offsetY, roomid }) => {
    socket.broadcast.to(roomid).emit('startDrawingCli', { offsetY, offsetX })
  })

  socket.on('finishDrawing', ({ roomid, drawStack }) => {
    socket.broadcast.to(roomid).emit('finishDrawingCli', drawStack)
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
}
const socketForLeaving = (io, socket) => {
  socket.on('leftRoom', ({ roomid }) => {
    socket.leave(roomid, () => {
      if (roomsAndUsers[roomid]) {
        roomsAndUsers[roomid].removeUserFromRoom(socket.id)
      }
      io.to(roomid).emit(
        'usersRoomUpdate',
        getUsersInRoom(roomsAndUsers, roomid)
      )
      io.emit('allRoomsQtyUpdate', roomsAndUsers)
      io.to(roomid).emit('gameStateUpdate', roomsAndUsers[roomid])
      socket.roomJoined = null
    })
  })

  socket.on('disconnect', () => {
    if (roomsAndUsers[socket.roomJoined]) {
      roomsAndUsers[socket.roomJoined].removeUserFromRoom(socket.id)
      io.to(socket.roomJoined).emit(
        'usersRoomUpdate',
        getUsersInRoom(roomsAndUsers, socket.roomJoined)
      )
      io.to(socket.roomJoined).emit(
        'gameStateUpdate',
        roomsAndUsers[socket.roomJoined]
      )
      socket.roomJoined = null

      io.emit('allRoomsQtyUpdate', roomsAndUsers)
    }
  })
}

module.exports = {
  start: (io) => {
    io.on('connection', (socket) => {
      socket.on('getId', () => {
        socket.emit('your id', socket.id)
      })

      socketForDrawing(socket)
      socketForChat(io, socket)
      socketForLeaving(io, socket)
      socketForGame(io, socket)
    })
  },
}

function getUsersInRoom(roomsAndUsersObj, room) {
  if (roomsAndUsers[room]) {
    return roomsAndUsersObj[room].users.map(
      (socket) => Object.values(socket)[0]
    )
  }
}
