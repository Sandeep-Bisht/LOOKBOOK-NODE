const passport = require("passport")
const router = require("express").Router()

const  products  = require('./products')
const { upload } = require('../../config/upload')

router.post('/product-create',passport.authenticate('jwt',{session:false}),upload.any('files'),products.create)
router.get('/all_products',products.get_all_products);

module.exports = router