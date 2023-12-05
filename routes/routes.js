const router = require("express").Router()
const AuthRoutes = require('../controllers/Auth/routes')
const UsersRoutes = require('../controllers/Users/routes');
const ServicesRoutes = require('../controllers/Services/routes');
const ProductsRoutes = require('../controllers/products/routes')
const BlogsRoutes = require('../controllers/Blog/routes')
// console.log("inside the routes")

router.use('/auth',AuthRoutes);
router.use('/users',UsersRoutes);
router.use('/service',ServicesRoutes);
router.use('/product',ProductsRoutes)
router.use('/blog',BlogsRoutes);

module.exports = router