const { default: mongoose } = require("mongoose");
const Chat = require("../models/chat");
const User = require("../models/user")


async function handleCreateOrAccessChat(req,res)
{
    const {userId}=req.body
    if(!userId){
        console.log("UserID not present")
        return res.status(404).end();
    } 

    let isChat = await Chat.find({
        isGroupChat:false,
        $and:[
            {users:{$elemMatch:{$eq:req.user._id}}},
            {users:{$elemMatch:{$eq:userId}}}
        ]
    }).populate('users','-password -salt').populate('latestMessages')

    isChat = await User.populate(isChat,{
        path:'latestMessages.sender',
        select:'name pic email'
    })

    if(isChat.length>0)
    {
        res.send(isChat[0])
    }
    else{
        let chatData = {
            chatName:'sender',
            isGroupChat:false,
            users:[
                req.user._id,
                userId
            ]
        }

        try {
            const createChat = await Chat.create(chatData)
            const fullChat = await Chat.findOne({_id:createChat._id}).populate('users','-password -salt').populate('latestMessages')

            return res.send(fullChat)
        } catch (error) {
            res.status('Error')
            throw new Error(error.message)
        }
    }
}


async function getAllChats(req,res)
{
    
    try {
       let allChats =  await Chat.find({users:{$elemMatch:{$eq:req.user._id}}})
       .populate('users',"-password -salt")
       .populate('groupAdmin',"-password -salt")
       .populate('latestMessages')
       .sort({updatedAt:-1})
       
        allChats = await User.populate(allChats,{
            path:'latestMessage.sender',
            select:'name pic email'
        })

       return res.send(allChats)
    } catch (error) {
        res.status(401)
        throw new Error(error.message)
    }

}

async function handleCreateGroup(req,res){
    if(!req.body.users || !req.body.name)
    {
        return res.status(400).send({msg:"Please fill all the feilds"})
    }

    let users = JSON.parse(req.body.users)

    if(users.length<2)
    {
        return res.status(400).send({msg:"More than two members are required"})
    }

    users.push(req.user)

    try {
        const groupChat = await Chat.create({
            chatName:req.body.name,
            users:users,
            isGroupChat:true,
            groupAdmin:req.user
        })

        const fullGroupChat = await Chat.findOne({_id:groupChat._id})
                                        .populate("users","-password -salt")
                                        .populate("groupAdmin","-password -salt")


        res.status(200).json(fullGroupChat)

    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }

}

async function handleGroupRename(req,res){
    const {chatId,chatName} = req.body

    const updateGroupName = await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName:chatName
        },
        {
            new:true
        }
    )
    .populate("users","-password -salt")
    .populate("groupAdmin","-password -salt")


    if(!updateGroupName)
    {
        res.status(404)
        throw new Error("No chat found")
    }
    else{
        return res.status(200).json(updateGroupName)
    }

}

async function handleRemoveFromGroup(req,res)
{
    const {chatId,userId} = req.body;

      

   const updateGroupMember =  await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull: { users: userId },
        },
        {
            new:true
        }
    ) .populate("users","-password -salt")
    .populate("groupAdmin","-password -salt")

    if(!updateGroupMember)
    {
        res.status(404)
        throw new Error('No user found to delete')
    }
    else{
        res.status(200).json(updateGroupMember)
    }
}

async function handleAddToGroup(req,res)
{   
    const {chatId,userId} = req.body;

    const updateGroupMember =  await Chat.findByIdAndUpdate(
         chatId,
         {
             $push:{users:userId}
         },
         {
             new:true
         }
     ) .populate("users","-password -salt")
     .populate("groupAdmin","-password -salt")
 
     if(!updateGroupMember)
     {
         res.status(404)
         throw new Error('No user found to delete')
     }
     else{
         res.status(200).json(updateGroupMember)
     } 
}

module.exports = {
    getAllChats,
    handleCreateOrAccessChat,
    handleCreateGroup,
    handleGroupRename,
    handleRemoveFromGroup,
    handleAddToGroup
}