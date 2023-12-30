const passport = require("passport")
const router = require("express").Router()

const  wishlist  = require('./wishlist')

 router.post('/mark_user_wishlist',passport.authenticate('jwt',{session:false}),wishlist.create)
// router.get('/all_products',passport.authenticate('jwt',{session:false}),wishlist.get_all_products);
// router.put('/product_update',passport.authenticate('jwt',{session:false}),wishlist.update_product);
router.get('/get_user_wishlist_by_id',passport.authenticate('jwt',{session:false}),wishlist.get_user_wishlist_by_id)

module.exports = router