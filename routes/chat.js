const {Router}  = require('express');
const { getAllChats, handleCreateGroup,handleCreateOrAccessChat,handleGroupRename,handleRemoveFromGroup,handleAddToGroup } = require('../controllers/chat');
const { checkForUser } = require('../middleware/auth');
const router = Router();


router.post("/",checkForUser,handleCreateOrAccessChat)
router.get("/",checkForUser,getAllChats)
router.post("/group",checkForUser,handleCreateGroup)
router.put('/grouprename',checkForUser,handleGroupRename)
router.put("/groupremove",checkForUser,handleRemoveFromGroup)
router.put("/groupadd",checkForUser,handleAddToGroup)


module.exports = router;