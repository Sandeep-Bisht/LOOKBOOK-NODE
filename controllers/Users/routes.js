const passport = require("passport")
const router = require("express").Router()

const { getAllUsers } = require('./getAllUsers')
const { setProfile, getProfile } = require('./profile')
const { upload } = require("../../config/upload")

router.get('/get-all-users',passport.authenticate('jwt',{session:false}),getAllUsers)
router.post('/setProfile',passport.authenticate('jwt',{session:false}),upload.any('files'),setProfile)
router.get('/getProfile',passport.authenticate('jwt',{session:false}),getProfile)

module.exports = router