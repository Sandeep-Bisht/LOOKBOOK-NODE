const passport = require("passport")
const router = require("express").Router()

const  slides  = require('./slides')
const { upload } = require('../../config/upload')

router.post('/slides-create',passport.authenticate('jwt',{session:false}),upload.any('files'),slides.create)
router.get('/all_slides',slides.get_all_slides);
router.put('/slides_update',passport.authenticate('jwt',{session:false}),upload.any('files'),slides.update_slides);
router.post('/get_slides_by_id/:_id',passport.authenticate('jwt',{session:false}),slides.get_slides_by_id)

module.exports = router