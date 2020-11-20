const roomsAndUsers = {}

class Game {
  constructor(roomid, user) {
    this.roomid = roomid
    this.users = [user]
    this.activeUser = null
    this.word = undefined
    this.isPlaying = false
    this.allChoseCorrectWord = false
    this.round = 0
    this.roundFinished = false
    this.gameFinished = false
  }

  setActiveUser(socketId) {
    this.room.activeUser = socketId
  }

  setWord(word) {
    this.word = word
  }

  addUser(user) {
    this.users.push(user)
    if (this.users.length === 2) this.startGame()
  }

  removeUserFromRoom(socketId) {
    this.users = this.users.filter((user) => Object.keys(user)[0] !== socketId)
    if (this.users.length < 2) {
      this.isPlaying = false
      this.round = 0
      this.gameFinished = false
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
    this.word = undefined
    this.allChoseCorrectWord = false
    this.activeUser = this.users[0]
    const active = Object.values(this.activeUser)[0]
    active.isTurnToDraw = true
  }

  nextPlayer(skipped) {
    const activeIdx = this.users.findIndex(
      (player) => player === this.activeUser
    )
    if (skipped) Object.values(this.activeUser)[0].points -= 2
    if (activeIdx === this.users.length - 1) {
      this.roundFinished = true
    } else {
      this.activeUser = this.users[activeIdx + 1]
      this.word = undefined
    }
  }

  nextRound() {
    if (this.round === 3) this.finishGame()
    else {
      this.startRound()
    }
  }

  finishGame() {
    this.round = 0
    // this.activeUser = null
    this.word = undefined
    this.gameFinished = true
  }
}

const createGame = (roomid, user) => {
  return new Game(roomid, user)
}

module.exports = { roomsAndUsers, createGame }
