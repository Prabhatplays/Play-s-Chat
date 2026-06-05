const db = require('../config/db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

async function signupUser(req, res) {
  const { username, password } = req.body

  // check if chomu's already exists
  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if(results.length > 0) {
      return res.status(400).json({ message: 'Username already exists' })
    }

    // encrypt password taki mujhe tumhara pass na pata chale
    const hashedPassword = await bcrypt.hash(password, 10)

    // save user to my golden database
    db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err) => {
      if(err) {
        return res.status(500).json({ message: 'Something went wrong' })
      }
      res.status(201).json({ message: 'Account created successfully!' })
    })
  })
}


// login function ooooo yaaaa

// user exits ?

async function loginUser(req, res) {
  const { username, password } = req.body

  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    // everything is inside here ✅
    if(results.length === 0) {
      return res.status(400).json({ message: 'User does not exist' })
    }

    const user = results[0]
    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch) {
      return res.status(400).json({ message: 'Wrong Hai Bhai Dubara Try Kar' })
    }

    const token = jwt.sign(
      { id: user.id, username: username },
      process.env.JWT_SECRET
    )

    res.status(200).json({ token, message: 'Login successful' })
  }) // ← callback ends here

}

  module.exports = { signupUser , loginUser}