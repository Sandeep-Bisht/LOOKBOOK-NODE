const router = require("express").Router()
const AuthRoutes = require('../controllers/Auth/routes')
const UsersRoutes = require('../controllers/Users/routes');
const ArtistCategoriesRoutes = require('../controllers/Artist_categories/routes')
const ServicesRoutes = require('../controllers/Services/routes');
const ProductsRoutes = require('../controllers/Products/routes')
const BlogsRoutes = require('../controllers/Blog/routes')
const ManagementRoutes = require('../controllers/Management/routes')
const ArtistRoutes = require('../controllers/Artist/routes')
const SearchRoutes = require('../controllers/Search/routes');
const WishlistRoutes = require('../controllers/Wishlist/routes');
const Category = require('../controllers/Category/routes')
const CommentRoutes = require('../controllers/Comments/routes')
const QueryRoutes = require('../controllers/Queries/routes')
const slidesRoutes = require('../controllers/slides/routes')
const CartRoutes = require('../controllers/Cart/routes')

router.use('/auth',AuthRoutes);
router.use('/users',UsersRoutes);
router.use('/artist-categories',ArtistCategoriesRoutes);
router.use('/service',ServicesRoutes);
router.use('/product',ProductsRoutes)
router.use('/blog',BlogsRoutes);
router.use('/artists',ArtistRoutes)
router.use('/management',ManagementRoutes)
router.use('/search',SearchRoutes);
router.use('/wishlist', WishlistRoutes);
router.use('/category',Category);
router.use('/comment',CommentRoutes);
router.use('/queries',QueryRoutes);
router.use('/slides',slidesRoutes);
router.use('/cart',CartRoutes);

module.exports = router