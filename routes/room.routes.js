const { Router } = require('express')
const Room = require('../models/Room')

const router = Router()

// /api/room/newroom
// for developer only
router.post('/newroom', async (req, res) => {
  try {
    const { roomName } = req.body
    const newRoom = new Room({ roomName })
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
