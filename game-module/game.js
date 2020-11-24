const roomsAndUsers = {}

class Game {
  constructor(roomid, user) {
    this.roomid = roomid
    this.users = [user]
    this.activeUser = null
    this.word = null
    this.isPlaying = false
    this.allChoseCorrectWord = false
    this.round = 0
    this.roundFinished = false
    this.gameFinished = false
    this.roundTimer = 10
  }

  setActiveUser(socketId) {
    this.room.activeUser = socketId
  }

  setWord(word) {
    this.word = word
  }

  setRoundTimer() {
    this.roundTimer--
  }

  addUser(user) {
    this.users.push(user)
    if (this.users.length === 1) this.activeUser = this.users[0]
    if (this.users.length === 2) this.startGame()
  }

  setDefaultGame() {
    this.activeUser = null
    this.word = null
    this.isPlaying = false
    this.allChoseCorrectWord = false
    this.round = 0
    this.roundFinished = false
    this.gameFinished = false
    this.roundTimer = 10
  }

  removeUserFromRoom(socketId) {
    if (this.users.length === 1) {
      this.users = []
      this.setDefaultGame()
    } else if (this.users.length === 2) {
      this.users = this.users.filter(
        (user) => Object.keys(user)[0] !== socketId
      )
      this.isPlaying = false
      this.setDefaultGame()
      this.activeUser = this.users[0]
    } else {
      if (this.activeUser && Object.keys(this.activeUser)[0] === socketId) {
        const activeIdx = this.users.findIndex(
          (player) => player === this.activeUser
        )
        activeIdx === this.users.length - 1
          ? (this.activeUser = this.users[0])
          : (this.activeUser = this.users[activeIdx + 1])
      }
      this.users = this.users.filter(
        (user) => Object.keys(user)[0] !== socketId
      )
    }
  }

  startGame() {
    this.isPlaying = true
    this.startRound()
  }

  startNewGame() {
    this.users.forEach((user) => {
      Object.values(user)[0].points = 0
    })
    this.gameFinished = false
    this.startRound()
  }

  startRound() {
    this.round++
    this.roundFinished = false
    this.word = null
    this.allChoseCorrectWord = false
    this.activeUser = this.users[0]
    const active = Object.values(this.activeUser)[0]
    active.isTurnToDraw = true
  }

  nextPlayer(skipped) {
    this.roundTimer = 10
    const activeIdx = this.users.findIndex(
      (player) => player === this.activeUser
    )
    if (skipped) Object.values(this.activeUser)[0].points -= 2
    if (activeIdx === this.users.length - 1) {
      this.roundFinished = true
    } else {
      this.activeUser = this.users[activeIdx + 1]
      this.activeUser.isTurnToDraw = true
      this.word = null
    }
  }

  nextRound(round) {
    if (round === 3) this.finishGame()
    else {
      this.startRound()
    }
  }

  finishGame() {
    this.round = 0
    this.word = null
    this.gameFinished = true
  }
}

const createGame = (roomid, user) => {
  const game = new Game(roomid, user)
  game.activeUser = user
  return game
}

module.exports = { roomsAndUsers, createGame }
