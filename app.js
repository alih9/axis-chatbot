const Joi=require('@hapi/joi');
const { validate } = require('@hapi/joi/lib/types/symbol');
const express=require('express');
const app = express();
const cors = require('cors');

const path=require('path');
const pathDirectory = path.join(__dirname, '/public');
const db = require("./models/index");
const auth = require('./middleware/auth');
const errorauth = require('./middleware/error-auth');
const RouteIndex = require('./routes/index');
db.sequelize.sync();


//middleware
app.use(cors());                       //cross-orgin
app.options('*', cors());
app.use(express.static(pathDirectory)) //making public folder to public for storing
app.use(express.json());               //request parser
app.use(express.urlencoded({extended: true}));
app.use(auth);                         //authorization
app.use(errorauth);                    //in case of any error

// Routes
app.use('/api',RouteIndex);
app.get('/', (req, res) => {
    res.send('Hello World');
})
    


const port = process.env.PORT;
console.log(process.env.PORT)
var host = app.listen(port,()=>console.log(`Listening to the port ${port}`));
  	
  

const color = require("colors");
const {  get_user_socketid, join_user,deactivate_Room,deactivate_User,add_active_users } = require("./controller/SocketUserController");
const socket = require("socket.io");
const io = socket(host);
setTimeout(() => {
  

//initializing the socket io connection 
io.on("connection", (socket) => {
  console.log('----------------->Start the Connection of the socket IO')


  socket.on("add_active_user", async(email) => {
    console.log(`----------------->Add active User ${email.email}`)
    
    //gets the room user and the message sent
    const active_user = await add_active_users(socket.id, email.email,socket);
    console.log('----------------->Added Active User',active_user);
  });
      
  //for a new user joining the room
  socket.on("joinRoom", async({ username, roomname }) => {
    
    //* create user
    console.log(`----------------->User ${username} joining the room ${roomname}`)
    const p_user =await join_user(username, roomname);
    socket.join(roomname);
    
    //display a welcome message to the user who have joined a room
    // socket.emit("message", {
      
    //   username: p_user.username,
    //   text: `Welcome ${p_user.username}`,
    //   welcome:true
    // });

    //displays a joined room message to all other room users except that particular user
    // socket.broadcast.to(p_user.room).emit("message", {
    //   userId: p_user.id,
    //   username: p_user.username,
    //   text: `${p_user.username} has joined the chat`,
    // });
  });



    //user sending message
    socket.on("active_room", async(user) => {
      //gets the room user and the message sent
    console.log('--------------------------------------user ---->check',user)
      
      const p_user =await get_user_socketid(user.tenant);
      if (p_user) {
        console.log('--------------------------------------Add active ROOM executed')
        io.to(p_user.socket_id).emit("add_active_room", {
          userId: p_user.socket_id,
          username: user.username,
          room: user.roomname,
        });
    
      }
      else {
      console.log('User not Active')
      }
    });


    socket.on("chat", async(user) => {
    })


  //user sending message
  socket.on("chat", async(user) => {
    //gets the room user and the message sent
    console.log('Chatting----------------------------->',user)
    const activeuser =await get_user_socketid(user.email);
    console.log('Sending message',activeuser)
    if(activeuser){
      socket.to(user.room).emit("message", {
        userId: activeuser.socket_id,
        username: activeuser.email,
        room: user.room,
        text: user.text,
    });
  }
  });
 



  socket.on('error', (error) => {
    console.log(error);
  });    



  //when the user exits the room
  socket.on("disconect", () => {
    //the user is deleted from array of users and a left room message displayed
    // const p_user = deactivate_User(socket.id);

    // if (p_user) {
      // io.to(p_user.room).emit("message", {
      //   userId: p_user.id,
      //   username: p_user.username,
      //   text: `${p_user.username} has left the room`,
      // });
    // }
  });

  socket.on("deactivate_room", (room) => {
    //the user is deleted from array of users and a left room message displayed
    // deactivate_User(socket.id);
    console.log('deactivate_roomdeactivate_roomdeactivate_roomdeactivate_roomdeactivate_room')
    socket.to(room.room_id).emit("deactivate_chat")
  });
});
}, 1000);


// https://gist.github.com/ywwwtseng/63c36ccb58a25a09f7096bbb602ac1de