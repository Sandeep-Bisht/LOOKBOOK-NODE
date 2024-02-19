const router = require("express").Router()

const passport = require("passport")
const { getAll, getByID, get_artist_pricing, updatePricing, getArtistByCategorySlug, getArtistBySlug, getUserArtistData } = require('./index')

router.get('/get-all-artists',getAll)
router.get('/get-artist-by-id/:artist_id',getByID)

// Pending
router.get('/get-artists-by-category-slug/:category_slug',getArtistByCategorySlug)
router.get('/get-artist-by-slug/:category_slug/:artist_slug',getArtistBySlug)

// Pending
router.get('/get-artist-pricing',passport.authenticate('jwt', {session:false}), get_artist_pricing);
router.post('/update-pricing', passport.authenticate('jwt', {session:false}), updatePricing)
router.get('/get-my-artist-data',passport.authenticate('jwt', {session:false}), getUserArtistData)


module.exports = router