const router = require("express").Router()
const { upload } = require('../../config/upload')

const passport = require("passport")
const { deleteArtistService,getAll, getByID, get_artist_pricing, updatePricing, getArtistByCategorySlug, getArtistBySlug, getUserArtistData, addNewService } = require('./index')

router.get('/get-all-artists',getAll)
router.get('/get-artist-by-id/:artist_id',getByID)

router.post('/add-service',passport.authenticate('jwt', {session:false}),upload.any('files'), addNewService)

// Pending
router.get('/get-artists-by-category-slug/:category_slug',getArtistByCategorySlug)
router.get('/get-artist-by-slug/:category_slug/:artist_slug',getArtistBySlug)

// Pending
router.get('/get-artist-pricing',passport.authenticate('jwt', {session:false}), get_artist_pricing);
router.post('/update-pricing', passport.authenticate('jwt', {session:false}), updatePricing)
router.get('/get-my-artist-data',passport.authenticate('jwt', {session:false}), getUserArtistData);
router.post('/delete-artist-service', passport.authenticate('jwt', {session:false}), deleteArtistService)


module.exports = router