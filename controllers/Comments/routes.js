
const router = require("express").Router()

const  comments  = require('./comments')

router.post('/comments-create',comments.create)
router.get('/all_comments',comments.getAllComments);
router.delete('/delete_comments_by_id/:comment_id',comments.deleteCommentById)
module.exports = router
 