const router = require("express").Router()

const { signup, signupVerify } = require('./signup')
const { googleSignup } = require('./googleLogin')
const { facebookSignup } = require('./facebookLogin')
const { sendotp, verifyOtp } = require('./verification')

router.post('/signup',signup)
router.post('/signup-verify',signupVerify)

router.post('/google',googleSignup)
router.post('/facebook',facebookSignup)
router.post('/verification/sendotp',sendotp)
router.post('/verification/verify',verifyOtp)

module.exports = router