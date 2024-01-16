const router = require("express").Router()

const passport = require("passport")
const { getAll, getByID, get_artist_pricing } = require('./index')

router.get('/get-all',getAll)
router.get('/get-by-id/:artist_id',getByID)
router.get('/get-pricing',passport.authenticate('jwt', {session:false}), get_artist_pricing)


module.exports = router