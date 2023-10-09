const Chat = require("../models/chat");
const Messages = require("../models/messages");
const User = require("../models/user");

async function handleCreateMessage(req,res)
{
    const {content,chatId} = req.body;

   
     if(!content || !chatId)
     {
        console.log('Invalid data passed to the request')
        return res.status(400)
     }

     let newMessage = {
        content:content,
        sender:req.user._id,
        chat:chatId
     }

    try {
        let message = await Messages.create(newMessage)
        message = await message.populate("sender","name pic")
         message = await message.populate('chat')
    
         message = await User.populate(message,{
            path:'chat.users',
            select:'name pic email'
         })
    
         await Chat.findByIdAndUpdate(req.body.chatId,{
            latestMessage:message
         })
    
         return res.json(message)
         
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }

}

async function handleAllMessagesForParticularChat(req,res)
{
    try {
        const message = await Messages.find({chat:req.params.chatid}).populate('sender','name pic email').populate('chat')
        return res.status(200).json(message)
    } catch (error) {
        res.status(404)
        throw new Error('No chat found')
    }    
}

module.exports={
    handleCreateMessage,
    handleAllMessagesForParticularChat
}