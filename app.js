require('dotenv').config();
const express = require('express')
const { connectToDb } = require('./config/db');
const cookieParser = require('cookie-parser')
const path  = require("path")
const {checkForToken} = require('./middleware/auth')
//Connect to Db
connectToDb()

const chatRoutes = require('./routes/chat');
const userRoutes = require('./routes/user')
const messageRoutes = require('./routes/messages')

const app = express();
const PORT = process.env.PORT || 8000;

//middleware
app.use(express.json())
app.use(cookieParser())
app.use(checkForToken('token'))
app.get('/',(req,res)=>{
    return res.json({msg:"Hello from server"})
})

app.use("/api/chat",chatRoutes)
app.use('/api/user',userRoutes)
app.use('/api/message',messageRoutes)

//----------Deployment--------

//-------------------------------

const server = app.listen(PORT,()=>console.log(`Server is running at ${PORT}`))

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
      origin: "http://localhost:3000",
      // credentials: true,
    },
  });

io.on('connection',(socket)=>{
    console.log("New Connection established")


  
       
        socket.on("setup", (userData) => {
          socket.join(userData._id);
          socket.emit("connected");
    })

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
      });

      socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;
        // console.log(newMessageRecieved);
        if (!chat.users) return console.log("chat.users not defined");
    
        chat.users.forEach((user) => {
          if (user._id == newMessageRecieved.sender._id) return;
    
          socket.in(chat._id).emit("message recieved", newMessageRecieved);
        });
      });


      socket.on("disconnect", (userData) => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
      });
})