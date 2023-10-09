const mongoose = require('mongoose')

const chatSchema =new mongoose.Schema({
    chatName:{
        type:String,
        trim:true
    },
    isGroupChat:{
        type:Boolean,
        default:false,

    },
    users:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }],
    latestMessages:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'messages'
    },
    groupAdmin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }

   
},{
    timestamps:true
})

const Chat = mongoose.model("chat",chatSchema)

module.exports = Chat