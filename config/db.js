const mongoose = require('mongoose')

const connectToDb = async ()=>{
    try {
        const conn = mongoose.connect(process.env.MONGO_URL,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
          
        })
        console.log(`MongoDb connected to `)
    } catch (error) {
            console.log(`Error.....${error.message}`)
            process.exit()
    }   
}

module.exports={connectToDb}