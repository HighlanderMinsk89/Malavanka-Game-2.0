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
    this.roundTimer = 30
    this.countMatch = 0
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
    this.roundTimer = 30
    this.countMatch = 0
  }

  removeUserFromRoom(socketId) {
    if (this.users.length === 1) {
      this.users = []
      this.setDefaultGame()
    } else if (this.users.length === 2) {
      this.users = this.users.filter(
        (user) => Object.keys(user)[0] !== socketId
      )
      this.users.forEach((user) => {
        Object.values(user)[0].points = 0
        Object.values(user)[0].roundPoints = 0
        Object.values(user)[0].match = false
      })
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
      Object.values(user)[0].roundPoints = 0
      Object.values(user)[0].match = false
    })
    this.gameFinished = false
    this.startRound()
  }

  startRound() {
    this.users.forEach((user) => {
      Object.values(user)[0].roundPoints = 0
    })
    this.round++
    this.roundFinished = false
    this.word = null
    this.allChoseCorrectWord = false
    this.activeUser = this.users[0]
    const active = Object.values(this.activeUser)[0]
    active.isTurnToDraw = true
  }

  nextPlayer(skipped) {
    // bonus for active
    if (this.countMatch === this.users.length - 1) {
      console.log('this.activeUser', this.activeUser)
      Object.values(this.activeUser)[0].points += this.roundTimer
      Object.values(this.activeUser)[0].roundPoints += this.roundTimer
    }
    this.users.forEach((user) => {
      Object.values(user)[0].match = false
    })
    this.roundTimer = 30
    this.countMatch = 0
    const activeIdx = this.users.findIndex(
      (player) => player === this.activeUser
    )
    if (skipped) {
      Object.values(this.activeUser)[0].points -= 10
      Object.values(this.activeUser)[0].roundPoints -= 10
    }
    if (activeIdx === this.users.length - 1) {
      this.roundFinished = true
    } else {
      this.activeUser = this.users[activeIdx + 1]
      this.activeUser.isTurnToDraw = true
      this.word = null
    }
  }

  calcPointsForUserOnMatch(socketId) {
    const user = this.users.find((user) => Object.keys(user)[0] === socketId)
    if (!user[socketId].match) {
      let points = 0
      points += this.roundTimer
      if (this.countMatch === 0) points += 30
      else if (this.countMatch === 1) points += 20
      else if (this.countMatch === 2) points += 10
      if (this.roundTimer > 15 && this.roundTimer <= 30) points *= 0.9
      if (this.roundTimer <= 15) points *= 0.8
      points = Math.floor(points)
      this.countMatch++
      user[socketId].points = user[socketId].points + points
      user[socketId].roundPoints = user[socketId].roundPoints + points
      user[socketId].match = true
      if (this.countMatch === this.users.length - 1) this.nextPlayer(false)
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
