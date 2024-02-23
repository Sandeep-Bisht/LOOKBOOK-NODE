const router = require("express").Router()
const passport = require("passport")

const { getCartData, updateCart, addCart, deleteCartItem } = require('./index')

router.get('/get-cart-data', passport.authenticate('jwt', {session:false}), getCartData)
router.get('/update-cart-data', passport.authenticate('jwt', {session:false}), updateCart)

router.post('/add-cart', passport.authenticate('jwt', {session:false}), addCart)
router.post('/delete-cart-item', passport.authenticate('jwt', {session:false}),deleteCartItem )

module.exports = router