const passport = require("passport")
const router = require("express").Router()

const  blogs  = require('./blog')
const { upload } = require('../../config/upload')

router.post('/blog-create',passport.authenticate('jwt',{session:false}),upload.any('files'),blogs.create)
router.get('/all_blogs',blogs.get_all_blog);
router.post('/get_blog_by_id',blogs.get_blog_by_id)
router.put('/blog_update',passport.authenticate('jwt',{session:false}),upload.any('files'),blogs.update_blog)
router.get('/get_blog_by_slug/:slug',blogs.get_blog_by_slug)
router.get('/get_blog_by_category_id/:category_id',blogs.get_Blog_CategoryById)
router.get('/get_blog_by_category_slug/:category_slug',blogs.get_Blog_By_CategorySlug)
module.exports = router
 