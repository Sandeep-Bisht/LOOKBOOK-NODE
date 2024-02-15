const passport = require("passport")
const router = require("express").Router()

const  sliders  = require('./sliders')
const { upload } = require('../../config/upload')

router.post('/sliders-create',passport.authenticate('jwt',{session:false}),upload.any('files'),sliders.create)
router.get('/all_sliders',sliders.get_all_sliders);
router.put('/sliders_update',passport.authenticate('jwt',{session:false}),upload.any('files'),sliders.update_slider);
router.post('/get_slider_by_id',passport.authenticate('jwt',{session:false}),sliders.get_slider_by_id)

module.exports = router