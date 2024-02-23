const router = require("express").Router()
const passport = require("passport")

const { getAllBookings } = require('./index')

router.get('/get-all-bookings', passport.authenticate('jwt', {session:false}), getAllBookings)

module.exports = router