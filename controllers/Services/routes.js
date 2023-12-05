const passport = require("passport")
const router = require("express").Router()

const  services  = require('./services')
const { upload } = require('../../config/upload')

router.post('/services-create',passport.authenticate('jwt',{session:false}),upload.any('files'),services.create)
router.get('/all_services',services.find_all);

module.exports = router