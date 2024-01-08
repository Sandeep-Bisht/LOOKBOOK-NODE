const passport = require("passport")
const router = require("express").Router()

const {create,getAllCategory,updateCategory,getCategoryById,deleteCategory} = require("./category")

router.post('/category_create',passport.authenticate('jwt',{session:false}),create)
router.get('/all_categories',getAllCategory)
router.get('/get_category_by_id/:category_id',getCategoryById)
router.put('/update_category',passport.authenticate('jwt',{session:false}),updateCategory)
router.delete('/delete_category/:category_id',passport.authenticate('jwt',{session:false}),deleteCategory)
module.exports = router

