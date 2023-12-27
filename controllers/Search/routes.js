const router = require("express").Router()

const { getInitialData } = require('./index')

router.get('/getInitialData',getInitialData)

module.exports = router