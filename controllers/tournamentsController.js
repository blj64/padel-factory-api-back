const Tournament = require('../models/Tournament')

// @desc Get all tournaments
// @route GET /tournaments
// @access Public
const getAllTournament = async (req, res) => {
    // Get all users from MongoDB
    const tournaments = await Tournament.find().lean()

    // If no users
    if (!tournaments?.length) {
        return res.status(400).json({ message: 'No tournament found' })
    }


    res.json(tournaments)
}

// @desc Create new tournament
// @route POST /tournaments
// @access Private
const createNewTournament = async  (req, res) => {
    const { name, description, date, player } = req.body
    // Confirm data
    if (!name || !description || !date || !player) {
        return res.status(400).json({ message: 'All fields are required'})
    }

    // Check for duplicates
    const duplicated = await Tournament.findOne({ name, date }).lean().exec()
    if (duplicated) {
        return res.status(409).json({ message: 'Duplicate tournament'})
    }


    const tournamentObject = { name, description, date, player}

    // Create and store new user
    const tournament = await Tournament.create(tournamentObject)

    if(tournament) { //created
        res.status(201).json({ message: `New tournament ${name} the ${date} created`})
    } else {
        res.status(400).json({ message: 'Invalid tournament data received'
        })
    }
}

// @desc Update a tournament
// @route PATCH /tournaments
// @access Private
const updateTournament = async  (req, res) => {
    const { id, name, description, date, players, active} = req.body

    // confirm data
    if (!id || !name || !description || typeof active !== 'boolean') {
        return res.status(400).json({ message: 'All fields are required'})
    }

    const tournament = await Tournament.findById(id).exec()

    if (!tournament) {
        return res.status(400).json({ message: 'Tournament not found'})
    }

    // Check for duplicate
    const duplicate = await Tournament.findOne({ name, date }).lean().exec()
    // Allow updates to the original user
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate tournament'})
    }

    tournament.name = name
    tournament.description = description
    tournament.date = date
    tournament.players = players
    tournament.active = active


    const updatedTournament = await tournament.save()

    res.json({ message: `${updatedTournament.name} updated`})
}

// @desc Delete a tournament
// @route DELETE /tournaments
// @access Private
const deleteTournament = async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Tournament ID Required' })
    }


    // Does the user exist to delete?
    const tournament = await Tournament.findById(id).exec()

    if (!tournament) {
        return res.status(400).json({ message: 'User not found' })
    }

    const result = await tournament.deleteOne()

    const reply = `Name ${result.name} with ID ${result._id} deleted`

    res.json(reply)
}

module.exports = {
    getAllTournament,
    createNewTournament,
    updateTournament,
    deleteTournament
}