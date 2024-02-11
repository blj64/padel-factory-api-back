const express = require('express')
const router = express.Router();
const tournamentsController = require('../controllers/tournamentsController')

router.route('/')
    .get(tournamentsController.getAllTournament)
    .post(tournamentsController.createNewTournament)
    .patch(tournamentsController.updateTournament)
    .delete(tournamentsController.deleteTournament)

module.exports = router