const router = require("express").Router()
const multer = require('multer');

// Set up multer to handle file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

const AuthRoutes = require('../controllers/Auth/routes')
const UsersRoutes = require('../controllers/Users/routes');
const { uploadFiles } = require("../config/upload");

router.use('/auth',AuthRoutes);
router.use('/users',UsersRoutes);

router.post('/upload', upload.single('file'), uploadFiles);


module.exports = router