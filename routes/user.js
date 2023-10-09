const {Router} = require('express');
const { handleSignUp,handleSignIn,handleAllUsersWithSearchQuery } = require('../controllers/user');
const { checkForUser } = require('../middleware/auth');

const router = Router()

router.post("/signup",handleSignUp)
router.post("/signin",handleSignIn)
router.get("/allusers",checkForUser,handleAllUsersWithSearchQuery)

module.exports = router;