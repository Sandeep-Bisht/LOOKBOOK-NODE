const passport = require("passport")
const router = require("express").Router()

const { verifyRequest } = require('./artist-requests/manage-artist-requests')

router.post('/artist-request',passport.authenticate('jwt',{session:false}),verifyRequest)

module.exports = router