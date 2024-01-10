const passport = require("passport")
const router = require("express").Router()

const { verifyRequest, artistRequestById, markFeaturedArtist, markEmergingArtist } = require('./artist-requests/manage-artist-requests');
const { getAdminDashboardInitialData } = require('./adminDashboardData/admin-dashboard-data')

router.post('/artist-request',passport.authenticate('jwt',{session:false}),verifyRequest)
router.get('/artist-request-by-id/:request_id',passport.authenticate('jwt',{session:false}),artistRequestById);
router.post('/mark-featured-artist', passport.authenticate('jwt', {session:false}), markFeaturedArtist);
router.post('/mark-emerging-artist', passport.authenticate('jwt', {session:false}), markEmergingArtist);
router.get('/get-admin-dashboard-initial-data', passport.authenticate('jwt', {session:false}), getAdminDashboardInitialData)


module.exports = router