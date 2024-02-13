    const mongoose = require('mongoose')

    const tournamentSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        date: {
            type: String,
            required: true
        },
        player: {
            type: Number,
            required: true
        },
        active: {
            type: Boolean,
            default: false
        },
        users: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }]
    })

    module.exports = mongoose.model('Tournament', tournamentSchema)