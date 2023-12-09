const passport = require("passport")
const router = require("express").Router()

const  products  = require('./products')
const { upload } = require('../../config/upload')

router.post('/product-create',passport.authenticate('jwt',{session:false}),upload.any('files'),products.create)
router.get('/all_products',passport.authenticate('jwt',{session:false}),products.get_all_products);
router.put('/product_update',passport.authenticate('jwt',{session:false}),upload.any('files'),products.update_product);
router.post('/get_product_by_id',passport.authenticate('jwt',{session:false}),products.get_product_by_id)

module.exports = router