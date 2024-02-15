const router = require("express").Router()
const passport = require("passport")

const { getCartData, updateCart, addCart } = require('./index')

router.get('/get-cart-data', passport.authenticate('jwt', {session:false}), getCartData)
router.get('/update-cart-data', passport.authenticate('jwt', {session:false}), updateCart)

router.post('/add-cart', passport.authenticate('jwt', {session:false}), addCart)

module.exports = router