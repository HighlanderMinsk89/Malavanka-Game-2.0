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

// /api/room/:id
// get users in specific room
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id
    const { users } = await Room.findOne({ _id: id })
    res.json(users)
  } catch (e) {
    res.status(500).json({ message: "Can't get users. Server error" })
  }
})

// /api/room/:id/adduser
// add user to the room
router.post('/:id/adduser', async (req, res) => {
  try {
    const id = req.params.id
    const newUser = req.body
    const room = await Room.findOne({ _id: id })
    room.users.push(newUser)
    await room.save()
    res
      .status(201)
      .json({ message: `${newUser.name} has been added to the room ${id}` })
  } catch (e) {
    res.status(500).json({ message: "Can't add user. Server error" })
  }
})

// /api/room/:id/removeuser
// add user to the room
router.put('/:id/removeuser', async (req, res) => {
  try {
    const id = req.params.id
    const userOrGuestId = req.body
    const room = await Room.findOne({ _id: id })
    room.users.pull({ userId: userOrGuestId, guestId: userOrGuestId })
    await room.save()
    res.json({ message: 'User has been removed from room' })
  } catch (e) {
    res.status(500).json({ message: "Can't delete user. Server Error" })
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
