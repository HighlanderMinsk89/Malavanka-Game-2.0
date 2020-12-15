const { revealWord } = require('../utils/utils')
const EventEmitter = require('events')
const gameState = {}

class GameRoom {
  constructor(roomid) {
    this.roomid = roomid
    this.roomEmitter = new EventEmitter()
    this.users = []
    this.activeUser = null
    this.word = null
    this.wordToShow = null
    this.isPlaying = false
    this.allChoseCorrectWord = false
    this.round = 0
    this.roundFinished = false
    this.gameFinished = false
    this.countMatch = 0
    this.roundTimer = null
    this.roundInterval = null
    this.wordSelectionTimer = null
    this.roundResultsTimer = null
    this.gameResultsTimer = null
  }

  setActiveUser(socketId) {
    this.activeUser = socketId
  }

  setWord(word) {
    this.word = word
    this.word.word = this.word.word.toUpperCase()
    this.wordToShow = this.word.word.replace(/./gi, '_')
  }

  setRoundTimer() {
    --this.roundTimer
    if (
      this.roundTimer === 45 ||
      this.roundTimer === 30 ||
      this.roundTimer === 15
    )
      if (this.word) {
        this.wordToShow = revealWord(this.word.word, this.wordToShow)
      }
  }

  addUser(user) {
    this.users.push(user)
    if (this.users.length === 1) this.setActiveUser(this.users[0])
    if (this.users.length === 2) this.startGame()
  }

  setDefaultGame() {
    this.activeUser = null
    this.word = null
    this.wordToShow = null
    this.isPlaying = false
    this.allChoseCorrectWord = false
    this.round = 0
    this.roundFinished = false
    this.gameFinished = false
    this.roundTimer = null
    this.countMatch = 0
    this.wordSelectionTimer = null
    this.roundResultsTimer = null
    this.gameResultsTimer = null
  }

  removeUserFromRoom(socketId, interval) {
    if (this.users.length === 1) {
      this.users = []
      this.setDefaultGame()
      this.isPlaying = false
      this.roundFinished = false
      clearInterval(interval)
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
      clearInterval(interval)
    } else {
      if (this.activeUser && Object.keys(this.activeUser)[0] === socketId) {
        clearInterval(interval)
        const activeIdx = this.users.findIndex(
          (player) => player === this.activeUser
        )

        if (activeIdx === this.users.length - 1) {
          this.activeUser = this.users[0]
        } else {
          this.activeUser = this.users[activeIdx + 1]
        }
        this.nextPlayer(false)
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
    this.round = 0
    this.startRound()
  }

  startRound() {
    this.users.forEach((user) => {
      Object.values(user)[0].roundPoints = 0
      Object.values(user)[0].isTurnToDraw = false
    })
    this.isPlaying = true
    this.round++
    this.roundFinished = false
    this.word = null
    this.wordToShow = null
    this.allChoseCorrectWord = false
    this.activeUser = this.users[0]
    const active = Object.values(this.activeUser)[0]
    active.isTurnToDraw = true
    Object.values(this.users[0]).isTurnToDraw = true
  }

  nextPlayer(skipped) {
    this.word = null
    this.wordToShow = null
    // bonus for active
    if (this.countMatch === this.users.length - 1) {
      Object.values(this.activeUser)[0].points += this.roundTimer
      Object.values(this.activeUser)[0].roundPoints += this.roundTimer
    }
    this.users.forEach((user) => {
      Object.values(user)[0].match = false
    })
    // this.roundTimer = 30
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

      Object.values(this.users[activeIdx])[0].isTurnToDraw = false
      Object.values(this.users[activeIdx + 1])[0].isTurnToDraw = true
      this.activeUser.isTurnToDraw = true
    }
  }

  calcPointsForUserOnMatch(socketId, interval) {
    const user = this.users.find((user) => Object.keys(user)[0] === socketId)
    if (!user[socketId].match) {
      let points = 0
      points += this.roundTimer
      if (this.countMatch === 0) points += 30
      else if (this.countMatch === 1) points += 20
      else if (this.countMatch === 2) points += 10
      if (this.roundTimer > 15 && this.roundTimer <= 30) points *= 0.9
      if (this.roundTimer <= 15) points *= 0.7
      points = Math.floor(points)
      this.countMatch++
      user[socketId].points = user[socketId].points + points
      user[socketId].roundPoints = user[socketId].roundPoints + points
      user[socketId].match = true
      if (this.countMatch === this.users.length - 1) {
        if (interval) clearInterval(interval)
        this.nextPlayer(false)
      }
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
    this.wordToShow = null
    this.gameFinished = true
    this.roundFinished = true
    // this.isPlaying = false
  }
}

const createGame = (roomid, user) => {
  const game = new GameRoom(roomid)
  game.addUser(user)
  return game
}

module.exports = { gameState, createGame }
