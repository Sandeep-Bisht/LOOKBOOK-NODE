const router = require("express").Router()

const { getAll, getByID } = require('./index')

router.get('/get-all',getAll)
router.get('/get-by-id/:artist_id',getByID)

module.exports = router