const mongoose = require('mongoose')

const tournamentSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    roles: [{
        type: String,
        default: "User"
    }],
    active: {
        type: Boolean,
        default: true
    }
})

module.exports = mongoose.model('Tournament', tournamentSchema)