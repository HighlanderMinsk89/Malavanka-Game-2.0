const { Router } = require('express')
const Room = require('../models/Room')
const { route } = require('./auth.routes')

const router = Router()

// /api/room/newroom
// for developer only
router.post('/newroom', async (req, res) => {
  try {
    const { roomName, chatMessages, users } = req.body
    const newRoom = new Room({ roomName, chatMessages, users })
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

router.get('/allrooms', async (req, res) => {
  try {
    const rooms = await Room.find({})
    res.status(200).json(rooms)
  } catch (e) {
    res.status(500).json({ message: "Can't get rooms. Server error" })
  }
})

// /api/room/deleteall
router.delete('/deleteall', async (req, res) => {
  try {
    await Room.deleteMany()
    res.status(202).json('deleted')
  } catch (e) {
    console.log(e)
  }
})

module.exports = router
