const mongoose = require('mongoose')

const messagesSchema = new mongoose.Schema({
    content:{
        type:String,
        trim:true,
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    chat:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'chat'
    }
},{timestamps:true})

const Messages = mongoose.model("messages",messagesSchema);
module.exports = Messages