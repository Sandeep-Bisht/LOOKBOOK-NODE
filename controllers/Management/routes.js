const passport = require("passport")
const router = require("express").Router()

const { verifyRequest, artistRequestById } = require('./artist-requests/manage-artist-requests')

router.post('/artist-request',passport.authenticate('jwt',{session:false}),verifyRequest)
router.get('/artist-request-by-id/:request_id',passport.authenticate('jwt',{session:false}),artistRequestById)


module.exports = router