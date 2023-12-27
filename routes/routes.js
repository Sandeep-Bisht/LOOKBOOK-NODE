const router = require("express").Router()
const AuthRoutes = require('../controllers/Auth/routes')
const UsersRoutes = require('../controllers/Users/routes');
const ServicesRoutes = require('../controllers/Services/routes');
const ProductsRoutes = require('../controllers/Products/routes')
const BlogsRoutes = require('../controllers/Blog/routes')
const ManagementRoutes = require('../controllers/Management/routes')
const ArtistRoutes = require('../controllers/Artist/routes')
const SearchRoutes = require('../controllers/Search/routes')

router.use('/auth',AuthRoutes);
router.use('/users',UsersRoutes);
router.use('/service',ServicesRoutes);
router.use('/product',ProductsRoutes)
router.use('/blog',BlogsRoutes);
router.use('/artists',ArtistRoutes)
router.use('/management',ManagementRoutes)
router.use('/search',SearchRoutes)

module.exports = router