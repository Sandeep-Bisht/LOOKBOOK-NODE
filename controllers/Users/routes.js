const passport = require("passport")
const router = require("express").Router()

const { getAllUsers } = require('./getAllUsers')
const { setProfile, getProfile } = require('./profile')

router.get('/get-all-users',passport.authenticate('jwt',{session:false}),getAllUsers)
router.post('/setProfile',passport.authenticate('jwt',{session:false}),setProfile)
router.get('/getProfile',passport.authenticate('jwt',{session:false}),getProfile)

module.exports = router