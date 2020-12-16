const { gameState, createGame, gameEmitter } = require('./game-module/game')
let globalIo, globalSocket

let roundIntervals = {}
let roundResultsIntervals = {}
let gameResultsIntervals = {}
let wordSelectionIntervals = {}

gameEmitter.on('activateRoundResultsTimer', ({ room, roomid }) => {
  setRoundResultsInterval(room, roomid)
})
gameEmitter.on('activateGameResultsTimer', ({ room, roomid }) => {
  setGameResultsInterval(room, roomid)
})

gameEmitter.on('activateSelectWordModal', ({ room, roomid, socketId }) => {
  setWordSelectionTimer(room, roomid, socketId)
})

const setRoundResultsInterval = (room, roomid) => {
  room.roundResultsTimer = 8
  roundResultsIntervals[roomid] = setInterval(() => {
    if (room.roundResultsTimer === 0) {
      room.nextRound(room.round)
      globalIo.to(roomid).emit('gameStateUpdate', room)
      globalIo
        .to(roomid)
        .emit('usersRoomUpdate', getUsersInRoom(gameState, roomid))
      globalSocket.emit('clearCanvasBeforeGame')
      clearInterval(roundResultsIntervals[roomid])
    } else {
      room.decrementTimer('roundResultsTimer')
      globalIo.to(roomid).emit('roundResultsTimer', room.roundResultsTimer)
    }
  }, 1000)
}

const setGameResultsInterval = (room, roomid) => {
  room.gameResultsTimer = 12
  gameResultsIntervals[roomid] = setInterval(() => {
    if (room.gameResultsTimer === 0) {
      room.startNewGame()
      globalIo.to(roomid).emit('clearChat')
      globalIo.to(roomid).emit('gameStateUpdate', room)
      globalIo
        .to(roomid)
        .emit('usersRoomUpdate', getUsersInRoom(gameState, roomid))
      clearInterval(gameResultsIntervals[roomid])
    } else {
      room.decrementTimer('gameResultsTimer')
      globalIo.to(roomid).emit('gameResultsTimer', room.gameResultsTimer)
    }
  }, 1000)
}

const setWordSelectionTimer = (room, roomid, socketId) => {
  room.wordSelectionTimer = 15
  wordSelectionIntervals[roomid] = setInterval(() => {
    if (room.wordSelectionTimer === 0) {
      clearInterval(wordSelectionIntervals[roomid])
      room.nextPlayer(true)
      globalIo.to(roomid).emit('gameStateUpdate', room)
      globalIo
        .to(roomid)
        .emit('usersRoomUpdate', getUsersInRoom(gameState, roomid))
    } else {
      console.log('(room.wordSelectionTimer', room.wordSelectionTimer)
      room.decrementTimer('wordSelectionTimer')
      globalIo.to(socketId).emit('wordSelectionTimer', room.wordSelectionTimer)
    }
  }, 1000)
}

const socketForGame = (io, socket) => {
  // *controls timer when user is drawing
  const setRoundInterval = (room, roomid) => {
    room.roundTimer = 30
    roundIntervals[roomid] = setInterval(() => {
      if (room.roundTimer === 0 || !room.isPlaying) {
        const body = {
          roomid,
          userName: 'Malavanka',
          message: `Вы адгадвалі слова "${room.word.word}"`,
        }
        io.to(roomid).emit('message', body)

        room.nextPlayer(false)

        io.to(roomid).emit('gameStateUpdate', room)
        io.to(roomid).emit('usersRoomUpdate', getUsersInRoom(gameState, roomid))
        socket.emit('clearCanvasBeforeGame')
        clearInterval(roundIntervals[roomid])
      } else {
        room.setRoundTimer()
        if (
          room.roundTimer === 45 ||
          room.roundTimer === 30 ||
          room.roundTimer === 15
        ) {
          io.to(roomid).emit('revealWord', room.wordToShow)
        }
        io.to(roomid).emit('drawingTimer', room.roundTimer)
      }
    }, 1000)
  }

  socket.on('wordSelected', ({ selectedWord, roomid }) => {
    if (gameState[roomid]) {
      gameState[roomid].setWord(selectedWord)
      socket.emit('clearCanvasBeforeGame')

      clearInterval(wordSelectionIntervals[roomid])
      setRoundInterval(gameState[roomid], roomid)
      io.to(roomid).emit('gameStateUpdate', gameState[roomid])
    }
  })

  socket.on('wordMatch', ({ roomid, socketId }) => {
    if (gameState[roomid]) {
      gameState[roomid].calcPointsForUserOnMatch(
        socketId,
        roundIntervals[roomid]
      )
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
      gameState[roomid].removeUserFromRoom(socket.id, [
        roundIntervals[roomid],
        wordSelectionIntervals[roomid],
        roundResultsIntervals[roomid],
        gameResultsIntervals[roomid],
      ])
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
        gameState[room].removeUserFromRoom(id, [
          roundIntervals[room],
          wordSelectionIntervals[room],
          roundResultsIntervals[room],
          gameResultsIntervals[room],
        ])
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
      globalIo = io
      globalSocket = socket
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
