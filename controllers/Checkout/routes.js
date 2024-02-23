const router = require("express").Router()
const passport = require("passport")

const { createOrder, verifyPayment} = require('./index')

router.get('/create-order', passport.authenticate('jwt', {session:false}), createOrder)
router.post('/verify-payment', passport.authenticate('jwt', {session:false}), verifyPayment)


module.exports = router