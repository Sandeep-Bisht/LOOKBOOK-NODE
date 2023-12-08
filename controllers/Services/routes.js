const passport = require("passport")
const router = require("express").Router()

const  services  = require('./services')
const { upload } = require('../../config/upload')

router.post('/services-create',passport.authenticate('jwt',{session:false}),upload.any('files'),services.create)
router.get('/all_services',services.get_all_services);
router.put('/services_update',passport.authenticate('jwt',{session:false}),upload.any('files'),services.update_service);
router.post('/get_service_by_id',passport.authenticate('jwt',{session:false}),services.get_service_by_id)

module.exports = router