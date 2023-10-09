const User = require("../models/user")


async function handleSignUp(req,res){
    console.log(req.body)
    const {name,email,password,pic} = req.body
    
    if(!name || !email || !password)
    {
        res.status(400)
        throw new Error('All fields are required');
    }

    const checkUserExsist = await User.findOne({email})
    console.log(checkUserExsist)
    if(checkUserExsist)
    {
        res.status(400)
        throw new Error('User already Exsist')
    }

    const user = await User.create({
        name,
        email,
        password,
        pic
    })
    
    return res.status(200).json({success:true})
}

async function handleSignIn(req,res){
    const {email,password} = req.body
    try {
        const resUser = await User.matchPassword(email,password);
 
        return res.cookie("token",resUser.token).json({...resUser,token:undefined})

    } catch (error) {
       
        return res.status(400).json({success:false})
    }
}

async function handleAllUsersWithSearchQuery(req,res)
{   

    
    const search = req.query.search?{
        $or:[
            {name:{$regex:req.query.search,$options: 'i'}}
        ]
    }:{}

    const allUsers = await User.find(search).find({_id:{$ne:req.user._id}}).select("-password -salt")
    
    if(!allUsers){
        return res.status(404).json({msg:'User not found'})
    }
    return res.status(200).send(allUsers)
}   

module.exports = {
    handleSignUp,
    handleSignIn,
    handleAllUsersWithSearchQuery
}