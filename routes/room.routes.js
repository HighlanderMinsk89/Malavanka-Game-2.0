const { Router } = require('express')
const Room = require('../models/Room')
const Word = require('../models/Word')
const { kolas, kolas_ru, kolas_en } = require('../utils/words')

const router = Router()

// /api/room/newroom
// for developer only
router.post('/newroom', async (req, res) => {
  try {
    const { roomName, authorImage, description } = req.body
    const newRoom = new Room({ roomName, authorImage, description })
    await newRoom.save()
    res.status(201).json({ message: 'Room Created' })
  } catch (e) {
    if (e.keyPattern) {
      res
        .status(400)
        .json({ message: 'Room with such a name is already exists' })
    }
    res.status(500).json({ message: "Can't create new room. Server Error", e })
  }
})

router.post('/addwordstoroom', async (req, res) => {
  try {
    const room = await Room.findById('5fd2919af634583234760145')
    console.log('room', room)

    const newWord = new Word({
      author: 'kupala',
      room: room._id,
      word: 'кавалак',
      word_ru: 'кусок',
      word_en: 'piece',
    })
    console.log('newWord', newWord)

    await newWord.save()

    // kolas.forEach(async (word, i) => {
    //   const newWord = new Word({
    //     author: 'kolas',
    //     room: room._id,
    //     word: kolas[i],
    //     word_ru: kolas_ru[i],
    //     word_en: kolas_en[i],
    //   })
    //   await newWord.save()
    // })

    res.status(201).json({ message: 'Got Word' })
  } catch (e) {
    res.status(500).json({ message: 'Server Error', e })
  }
})

router.get('/test', async (req, res) => {
  try {
    const room = await Room.findById('5fd279770199ba7adc2e853c')
    console.log(room.words[0])
    res.json(room.words[0])
  } catch (error) {}
})

router.get('/allrooms', async (req, res) => {
  try {
    const rooms = await Room.find({})

    res.status(200).json(rooms)
  } catch (e) {
    res.status(500).json({ message: "Can't get rooms. Server error" })
  }
})

//userJoinedRoom
router.put('/userJoined', async (req, res) => {
  try {
    const { roomid, user } = req.body
    const room = await Room.findById(roomid)
    room.users.push(user)
    ++room.usersOnlineNum
    await room.save()
    res.status(204).json({ message: `${user.userName} joined room {roomid}` })
  } catch (e) {
    res
      .status(500)
      .json({ message: "Can't update users in room. Server error" })
  }
})

//userLeftTheRoom
router.put('/userLeft', async (req, res) => {
  try {
    const { roomid, userId } = req.body
    const room = await Room.findById(roomid)
    room.users = room.users.filter((user) => user.socketId !== userId)
    --room.usersOnlineNum
    await room.save()
    res.status(204).json({ message: `User left room ${roomid}` })
  } catch (e) {
    res
      .status(500)
      .json({ message: "Can't update users in room. Server error" })
  }
})

// /api/room/deleteall
//dev only
router.delete('/deleteall', async (req, res) => {
  try {
    await Room.deleteMany()
    res.status(202).json('deleted')
  } catch (e) {
    console.log(e)
  }
})

module.exports = router
