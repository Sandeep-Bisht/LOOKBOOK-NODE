const ProfileController = require('./profileController');
const router = require("express").Router();


router.post("/create-profile", ProfileController.createProfile);
module.exports = router;