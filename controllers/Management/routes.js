const passport = require("passport")
const router = require("express").Router()

const { verifyRequest, artistRequestById, markFeaturedArtist } = require('./artist-requests/manage-artist-requests')

router.post('/artist-request',passport.authenticate('jwt',{session:false}),verifyRequest)
router.get('/artist-request-by-id/:request_id',passport.authenticate('jwt',{session:false}),artistRequestById);
router.post('/mark-featured-artist', passport.authenticate('jwt', {session:false}), markFeaturedArtist);


module.exports = router