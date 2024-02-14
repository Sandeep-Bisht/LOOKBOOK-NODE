const router = require("express").Router()

const passport = require("passport")
const { getAll, getByID, get_artist_pricing, updatePricing, getArtistsByServiceSlug, getArtistByAlias } = require('./index')

router.get('/get-all-artists',getAll)
router.get('/get-artist-by-id/:artist_id',getByID)
router.get('/get-artists-by-service-slug/:service_slug',getArtistsByServiceSlug)
router.get('/get-artist-by-alias/:service_slug/:artist_alias',getArtistByAlias)
router.get('/get-artist-pricing',passport.authenticate('jwt', {session:false}), get_artist_pricing);
router.post('/update-pricing', passport.authenticate('jwt', {session:false}), updatePricing)


module.exports = router