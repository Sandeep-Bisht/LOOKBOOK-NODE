const passport = require("passport")
const router = require("express").Router()

const  blogs  = require('./blog')
const { upload } = require('../../config/upload')

router.post('/blog-create',passport.authenticate('jwt',{session:false}),upload.any('files'),blogs.create)
router.get('/all_blogs',blogs.get_all_blog);

module.exports = router
