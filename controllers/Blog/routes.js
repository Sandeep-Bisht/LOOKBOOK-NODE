const passport = require("passport")
const router = require("express").Router()

const  blogs  = require('./blog')
const { upload } = require('../../config/upload')

router.post('/blog-create',upload.any('files'),blogs.create)
router.get('/all_blogs',blogs.find_all);

module.exports = router
