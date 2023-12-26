const router = require("express").Router()

const { getAll } = require('./index')

router.get('/get-all',getAll)

module.exports = router