const passport = require("passport")
const router = require("express").Router()

const {create,getAllCategory,updateCategory} = require("./category")

router.post('/category_create',passport.authenticate('jwt',{session:false}),create)
router.get('/all_categories',getAllCategory)
router.put('/update_category',passport.authenticate('jwt',{session:false}),updateCategory)
module.exports = router

