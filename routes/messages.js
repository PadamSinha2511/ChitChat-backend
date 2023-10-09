const {Router} = require('express');
const { checkForUser } = require('../middleware/auth');
const { handleCreateMessage, handleAllMessagesForParticularChat } = require('../controllers/message');
const router = Router();


router.post("/",checkForUser,handleCreateMessage)
router.get("/:chatid",checkForUser,handleAllMessagesForParticularChat)

module.exports=router