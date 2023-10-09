const mongoose = require('mongoose')
const {createHmac,randomBytes} = require("node:crypto")
const { generateToken } = require('../config/auth')
const userSchema =new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    salt:{
        type:String
    },
    password:{
        type:String,
        required:true
    },
    pic:{
        type:String,
        default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    },
    isAdmin:{
        type:Boolean,
        required:true,
        default:false
    }
},{timestamps:true})

userSchema.static('matchPassword',async function(email,password){
    const user = await this.findOne({email})
    if(!user) throw new Error('User does not exsist')

    const salt = user.salt
    const hashedPassword = user.password

    const userGivenPasswordHashed = createHmac('sha256',salt).update(password).digest('hex' )
    
    if(userGivenPasswordHashed != hashedPassword) throw new Error('Password does not matched')

    const token  = generateToken(user)
    const resUser = {
        name:user.name,
        _id:user._id,
        email:user.email,
        pic:user.pic,
        isAdmin:user.isAdmin,
        token
    }
    return resUser


})

userSchema.pre('save',function(next){
    const user = this;

    const salt = randomBytes(16).toString();

    const hashedPassword = createHmac('sha256',salt).update(user.password).digest('hex')

    this.salt = salt;
    this.password = hashedPassword
    next();
})


const User = mongoose.model("user",userSchema)

module.exports = User