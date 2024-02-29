const passport = require("passport")
const router = require("express").Router()

const { verifyRequest, artistRequestById, markFeaturedArtist, markEmergingArtist } = require('./artist-requests/manage-artist-requests');
const { getAdminDashboardInitialData } = require('./adminDashboardData/admin-dashboard-data')
const { get_all_blog} = require('./blogs/blogs')

router.post('/artist-request',passport.authenticate('jwt',{session:false}),verifyRequest)
router.get('/artist-request-by-id/:request_id',passport.authenticate('jwt',{session:false}),artistRequestById);
router.post('/mark-featured-artist', passport.authenticate('jwt', {session:false}), markFeaturedArtist);
router.post('/mark-emerging-artist', passport.authenticate('jwt', {session:false}), markEmergingArtist);
router.get('/get-admin-dashboard-initial-data', passport.authenticate('jwt', {session:false}), getAdminDashboardInitialData)
router.get('/get-all-blog', passport.authenticate('jwt', {session:false}), get_all_blog)


module.exports = router