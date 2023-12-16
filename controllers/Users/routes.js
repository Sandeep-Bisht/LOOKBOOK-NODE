const passport = require("passport")
const router = require("express").Router()

const { setProfile, getProfile } = require('./profile')
const { getArtistRequests, updateArtistRequest, updateArtistRequestStatus, getAllArtistRequest } = require('./artistsRequest')
const { upload } = require("../../config/upload")

router.post('/setProfile',passport.authenticate('jwt',{session:false}),upload.any('files'),setProfile)
router.get('/getProfile',passport.authenticate('jwt',{session:false}),getProfile)

router.get('/getArtistRequests',passport.authenticate('jwt',{session:false}),getArtistRequests)
router.post('/updateArtistRequest',passport.authenticate('jwt',{session:false}),upload.any('files'),updateArtistRequest)
router.get('/updateArtistRequestStatus/:status',passport.authenticate('jwt',{session:false}),updateArtistRequestStatus)
router.get('/getAllArtistRequest',passport.authenticate('jwt',{session:false}),getAllArtistRequest)


module.exports = router