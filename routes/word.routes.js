const { Router } = require('express')
const { Types } = require('mongoose')
const Word = require('../models/Word')

const router = Router()

// api/word/addword
router.post('/addword', async (req, res) => {
  try {
    const { word } = req.body
    const newWord = new Word({ word })
    await newWord.save()
    res.status(201).json({ message: 'Word added' })
  } catch (error) {
    console.error(error)
  }
})

// api/word/getrandom3
router.get('/getrandom3/:roomid', async (req, res) => {
  try {
    const roomid = req.params.roomid
    const allWords = await Word.aggregate([
      { $match: { room: new Types.ObjectId(roomid) } },
      { $sample: { size: 3 } },
    ])

    res.status(200).json(allWords)
  } catch (error) {
    console.error(error)
  }
})

module.exports = router
