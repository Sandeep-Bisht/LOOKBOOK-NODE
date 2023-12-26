const passport = require("passport")
const router = require("express").Router()

const  blogs  = require('./blog')
const { upload } = require('../../config/upload')

router.post('/blog-create',passport.authenticate('jwt',{session:false}),upload.any('files'),blogs.create)
router.get('/all_blogs',blogs.get_all_blog);
router.post('/get_blog_by_id',passport.authenticate('jwt',{session:false}),blogs.get_blog_by_id)
router.put('/blog_update',passport.authenticate('jwt',{session:false}),upload.any('files'),blogs.update_blog)
module.exports = router
 