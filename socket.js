const { gameState, createGame } = require('./game-module/game')

const socketForGame = (io, socket) => {
  socket.on('wordSelected', ({ selectedWord, roomid }) => {
    if (gameState[roomid]) {
      gameState[roomid].setWord(selectedWord)
      gameState[roomid].roundTimer = 30
      io.to(roomid).emit('gameStateUpdate', gameState[roomid])
      socket.emit('clearCanvasBeforeGame')
    }
  })

  socket.on('playerSkippedDrawing', (roomid) => {
    if (gameState[roomid]) {
      gameState[roomid].nextPlayer(true)
      io.to(roomid).emit('gameStateUpdate', gameState[roomid])
      io.to(roomid).emit('usersRoomUpdate', getUsersInRoom(gameState, roomid))
      socket.emit('clearCanvasBeforeGame')
    }
  })

  socket.on('nextRound', ({ roomid, round }) => {
    if (gameState[roomid]) {
      gameState[roomid].nextRound(round)
      io.to(roomid).emit('gameStateUpdate', gameState[roomid])
      io.to(roomid).emit('usersRoomUpdate', getUsersInRoom(gameState, roomid))
      socket.emit('clearCanvasBeforeGame')
    }
  })
  socket.on('newGame', (roomid) => {
    if (gameState[roomid]) {
      gameState[roomid].startNewGame()
      io.to(roomid).emit('clearChat')
      io.to(roomid).emit('gameStateUpdate', gameState[roomid])
      io.to(roomid).emit('usersRoomUpdate', getUsersInRoom(gameState, roomid))
    }
  })
  socket.on('drawFinishedNextPlayer', (roomid) => {
    if (gameState[roomid]) {
      gameState[roomid].nextPlayer(false)
      io.to(roomid).emit('gameStateUpdate', gameState[roomid])
      io.to(roomid).emit('usersRoomUpdate', getUsersInRoom(gameState, roomid))
      socket.emit('clearCanvasBeforeGame')
    }
  })

  socket.on('roundTimer', ({ roomid }) => {
    if (gameState[roomid]) {
      gameState[roomid].setRoundTimer()
      io.to(roomid).emit('roundTimerUpdate', gameState[roomid].roundTimer)
      io.to(roomid).emit('gameStateUpdate', gameState[roomid])
    }
  })

  socket.on('wordMatch', ({ roomid, socketId }) => {
    if (gameState[roomid]) {
      gameState[roomid].calcPointsForUserOnMatch(socketId)
      io.to(roomid).emit('gameStateUpdate', gameState[roomid])
      io.to(roomid).emit('usersRoomUpdate', getUsersInRoom(gameState, roomid))
    }
  })
}

const socketForChat = (io, socket) => {
  socket.on('userJoined', ({ userName, location, roomid, socketId }) => {
    socket.join(roomid)

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

    if (!gameState[roomid]) {
      gameState[roomid] = createGame(roomid, newSocketUser)
    } else {
      gameState[roomid].addUser(newSocketUser)
    }

    io.to(roomid).emit('gameStateUpdate', gameState[roomid])

    if (gameState[roomid].users.length === 2) {
      socket.emit('clearCanvasBeforeGame')
    }

    socket.emit('welcomeMessage', 'Welcome to the chat')
    socket.broadcast
      .to(roomid)
      .emit('userJoinedMessage', `${userName} has joined the chat`)

    io.to(roomid).emit('usersRoomUpdate', getUsersInRoom(gameState, roomid))
    io.emit('allRoomsQtyUpdate', gameState)
  })

  socket.on('getRoomCapacity', () => {
    socket.emit('allRoomsQtyUpdate', gameState)
  })

  socket.on('send message', (body) => {
    io.to(body.roomid).emit('message', body)
  })
}

const socketForDrawing = (socket) => {
  socket.on('startDrawing', ({ offsetX, offsetY, roomid }) => {
    socket.broadcast.to(roomid).emit('startDrawingCli', { offsetY, offsetX })
  })

  socket.on('finishDrawing', ({ roomid, stack }) => {
    socket.broadcast.to(roomid).emit('finishDrawingCli', stack)
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
    if (gameState[roomid]) {
      gameState[roomid].removeUserFromRoom(socket.id)
    }
    io.to(roomid).emit('usersRoomUpdate', getUsersInRoom(gameState, roomid))
    io.to(roomid).emit('gameStateUpdate', gameState[roomid])
    io.emit('allRoomsQtyUpdate', gameState)
    socket.leave(roomid)
  })

  socket.on('disconnecting', () => {
    const [id, room] = Array.from(socket.rooms)
    if (room) {
      if (gameState[room]) {
        gameState[room].removeUserFromRoom(id)
        io.to(room).emit('gameStateUpdate', gameState[room])
        io.to(room).emit('usersRoomUpdate', getUsersInRoom(gameState, room))
        io.emit('allRoomsQtyUpdate', gameState)
      }
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

function getUsersInRoom(gameStateObj, room) {
  if (gameState[room]) {
    return gameStateObj[room].users.map((socket) => Object.values(socket)[0])
  }
}
