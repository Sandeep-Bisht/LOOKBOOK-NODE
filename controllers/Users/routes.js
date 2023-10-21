const passport = require("passport")
const router = require("express").Router()

const { getAllUsers } = require('./getAllUsers')

router.get('/get-all-users',passport.authenticate('jwt',{session:false}),getAllUsers)

module.exports = router