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
const { get_Current_User, user_Disconnect, join_User,send_Msg_User,deactivate_Room,add_active_user } = require("./controller/SocketUserController");
const socket = require("socket.io");
const io = socket(host);

//initializing the socket io connection 
io.on("connection", (socket) => {
  //for a new user joining the room
  socket.on("joinRoom", ({ username, roomname }) => {
    //* create user
    const p_user = join_User(socket.id, username, roomname);
    console.log(socket.id, "=id");
    socket.join(p_user.room);
    
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
  socket.on("chat", (text) => {
    //gets the room user and the message sent
    const p_user = get_Current_User(socket.id);

    io.to(p_user.room).emit("message", {
      userId: p_user.id,
      username: p_user.username,
      text: text,
    });
  });

  socket.on("add_active_user", (email) => {
    //gets the room user and the message sent
    const active_user = add_active_user(socket.id, email);
    
  });

    

  //user sending message
  socket.on("active_room", (user) => { 
    //gets the room user and the message sent
    const p_user = get_Current_User(socket.id);
    if (p_user) {
      console.log('--------------------------------------Add active ROOM executed')
      io.emit("add_active_room", {
        userId: p_user.id,
        username: p_user.username,
        room: user.roomname,
      });
  
    }
    else {
    console.log('User not Active')
    }
  });

  socket.on('error', (error) => {
    console.log(error);
  });    

  socket.on("chat1", (text) => {
    //gets the room user and the message sent
    // console.log(socket)
    const p_user = send_Msg_User(socket.id);
    if (p_user == null) {
      console.log('User Not available')
    }

    else {
      
      console.log('----------------------------------chat1')
      console.log(p_user);
      p_user.map((user) => {
      
        io.to(user.id).emit("message", {
          userId: user.id,
          username: user.username,
          room: user.room,
          text: text,
        });
        console.log('Send to only User')
        console.log(user)
      })
      
    }
  
  });
  //when the user exits the room
  socket.on("disconect", () => {
    //the user is deleted from array of users and a left room message displayed
    const p_user = user_Disconnect(socket.id);

    if (p_user) {
      // io.to(p_user.room).emit("message", {
      //   userId: p_user.id,
      //   username: p_user.username,
      //   text: `${p_user.username} has left the room`,
      // });
    }
  });

  socket.on("deactivate_room", (id) => {
    //the user is deleted from array of users and a left room message displayed
    deactivate_Room(id);

  });
});