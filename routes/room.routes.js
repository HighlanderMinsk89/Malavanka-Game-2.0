const { Router } = require('express')
const Room = require('../models/Room')

const router = Router()

// /api/room/newroom

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

module.exports = router
