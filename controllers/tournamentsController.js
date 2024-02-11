const Tournament = require('../models/Tournament')
const Note = require('../models/Note')
const bcrypt = require('bcrypt')

// @desc Get all users
// @route GET /users
// @access Private
const getAllTournament = async (req, res) => {
    // Get all users from MongoDB
    const tournaments = await Tournament.find().select('-password').lean()

    // If no users
    if (!tournaments?.length) {
        return res.status(400).json({ message: 'No users found' })
    }

    res.json(tournaments)
}

// @desc Create new user
// @route POST /users
// @access Private
const createNewTournament = async  (req, res) => {
    const { username, password, roles } = req.body
    // Confirm data
    if (!username || !password || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({ message: 'All fields are required'})
    }

    // Check for duplicates
    const duplicated = await Tournament.findOne({ username }).lean().exec()
    if (duplicated) {
        return res.status(409).json({ message: 'Duplicate username'})
    }

    // Hash password
    const hashedPwd = await bcrypt.hash(password, 10) // salt rounds

    const tournamentObject = { username, "password": hashedPwd, roles}

    // Create and store new user
    const tournament = await Tournament.create(tournamentObject)

    if(tournament) { //created
        res.status(201).json({ message: `New user ${username} created`})
    } else {
        res.status(400).json({ message: 'Invalid user data received'
        })
    }
}

// @desc Update a user
// @route PATCH /users
// @access Private
const updateTournament = async  (req, res) => {
    const { id, username, roles, active, password} = req.body

    // confirm data
    if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
        return res.status(400).json({ message: 'All fields are required'})
    }

    const tournament = await Tournament.findById(id).exec()

    if (!tournament) {
        return res.status(400).json({ message: 'tournament not found'})
    }

    // Check for duplicate
    const duplicate = await Tournament.findOne({ username }).lean().exec()
    // Allow updates to the original user
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate username'})
    }

    tournament.username = username
    tournament.roles = roles
    tournament.active = active

    if (password) {
        // Hash password
        tournament.password = await bcrypt.hash(password, 10) // salt rounds
    }
    const updatedTournament = await tournament.save()

    res.json({ message: `${updatedTournament.username} updated`})
}

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteTournament = async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Tournament ID Required' })
    }

    // Does the user still have assigned notes?
    const note = await Note.findOne({ user: id }).lean().exec()
    if (note) {
        return res.status(400).json({ message: 'Tournament has assigned notes' })
    }

    // Does the user exist to delete?
    const tournament = await Tournament.findById(id).exec()

    if (!tournament) {
        return res.status(400).json({ message: 'User not found' })
    }

    const result = await tournament.deleteOne()

    const reply = `Username ${result.username} with ID ${result._id} deleted`

    res.json(reply)
}

module.exports = {
    getAllTournament,
    createNewTournament,
    updateTournament,
    deleteTournament
}