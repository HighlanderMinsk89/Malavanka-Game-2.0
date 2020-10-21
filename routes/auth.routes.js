const { Router } = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const { check, validationResult } = require('express-validator')
const User = require('../models/User')
const router = Router()

// /api/auth/register
router.post(
  '/register',
  [
    check('email', 'Incorrect email').isEmail(),
    check('password', 'Minimum number of characters is 6').isLength({ min: 6 }),
    check('name', 'Name should not be empty').notEmpty(),
  ],
  async (req, res) => {
    try {
      const { name, email, password, location } = req.body

      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Incorrect registration data',
        })
      }

      const candidate = await User.findOne({ email })

      if (candidate)
        return res
          .status(400)
          .json({ message: 'User with such an email is already registered' })

      const hashedPass = await bcrypt.hash(password, 12)
      const user = new User({ name, email, password: hashedPass, location })

      await user.save()

      res.status(201).json({ message: 'New user has been created', user })
    } catch (e) {
      res.status(500).json({ message: 'Something wrong on server', error: e })
    }
  }
)

// /api/auth/login
router.post(
  '/login',
  [
    check('email', 'Enter correct email').normalizeEmail().isEmail(),
    check('password', 'Enter password').exists(),
  ],
  async (req, res) => {
    try {
      const { email, password } = req.body

      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Incorrect login data',
        })
      }

      const user = await User.findOne({ email })
      if (!user) {
        return res.status(400).json({ message: 'Incorrect email or password' })
      }

      const isPassMatch = await bcrypt.compare(password, user.password)
      if (!isPassMatch) {
        return res.status(400).json({ message: 'Incorrect email or password' })
      }

      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          name: user.name,
        },
        config.get('jwtSecret'),
        { expiresIn: '3h' }
      )

      res.json({
        token,
        userId: user.id,
        message: `${user.name} successfully logged in`,
      })
    } catch (e) {
      res.status(500).json({ message: 'Something wrong on server', error: e })
    }
  }
)

module.exports = router
