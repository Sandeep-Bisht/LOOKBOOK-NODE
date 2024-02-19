const passport = require("passport")
const router = require("express").Router()

const  artist_category  = require('./index')
const { upload } = require('../../config/upload')

router.post('/artist-category-create',passport.authenticate('jwt',{session:false}),upload.any('files'),artist_category.create)
router.get('/all-artist-categories',artist_category.get_all_artist_categories);
router.put('/artist-category-update',passport.authenticate('jwt',{session:false}),upload.any('files'),artist_category.update_artist_category);

router.get('/get_artist_category_by_id/:_id',passport.authenticate('jwt',{session:false}),artist_category.get_artist_category_by_id)

module.exports = router