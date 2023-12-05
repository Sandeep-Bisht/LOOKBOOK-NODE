const router = require("express").Router()


const AuthRoutes = require('../controllers/Auth/routes')
const UsersRoutes = require('../controllers/Users/routes');


router.use('/auth',AuthRoutes);
router.use('/users',UsersRoutes);



module.exports = router