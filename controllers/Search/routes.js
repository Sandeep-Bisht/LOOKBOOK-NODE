const router = require("express").Router()

const { getInitialData, findArtist } = require('./index')

router.get('/getInitialData',getInitialData)
router.get('/findArtist',findArtist)

module.exports = router