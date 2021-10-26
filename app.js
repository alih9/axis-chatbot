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
const { get_Current_User, user_Disconnect, join_User,send_Msg_User,deactivate_Room,add_active_user,get_reciever_user,get_active_user } = require("./controller/SocketUserController");
const socket = require("socket.io");
const io = socket(host);
setTimeout(() => {
  
// console.log('------------io',io)
//initializing the socket io connection 
io.on("connection", (socket) => {
  console.log('----------------->Start the Connection of the socket IO')


  socket.on("add_active_user", async(email) => {
    console.log(`----------------->Add active User ${email.email}`)
    
    //gets the room user and the message sent
    const active_user = await add_active_user(socket.id, email.email);
    console.log('----------------->Added Active User',active_user);
  });
      
  //for a new user joining the room
  socket.on("joinRoom", async({ username, roomname }) => {
    
    //* create user
    console.log(`----------------->User ${username} joining the room ${roomname}`)
    const p_user =await join_User(username, roomname);
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
    socket.on("active_room", async(user) => {
      //gets the room user and the message sent
    console.log('--------------------------------------user ---->check',user)
      
      const p_user =await get_Current_User(user.tenant);
      if (p_user) {
        console.log('--------------------------------------Add active ROOM executed')
        io.to(p_user.id).emit("add_active_room", {
          userId: p_user.id,
          username: user.username,
          room: user.roomname,
        });
    
      }
      else {
      console.log('User not Active')
      }
    });





  //user sending message
  socket.on("chat", async(user) => {
    //gets the room user and the message sent
    console.log('Chatting----------------------------->',user)
    const activeuser =await get_reciever_user(user.email);
    if(activeuser!=null){
      io.to(activeuser.id).emit("message", {
        userId: activeuser.id,
        username: activeuser.username,
        room: user.room,
        text: user.text,
    });
  }
  });
 



                                                            
       






  socket.on('error', (error) => {
    console.log(error);
  });    



  // socket.on("chat1", (text) => {//gets the room user and the message sent
  //   const p_user = send_Msg_User(socket.id);
  //   if (p_user == null) {
  //     console.log('User Not available')
  //   }

  //   else {
      
  //     console.log('----------------------------------chat1')
  //     console.log(p_user);
  //     p_user.map((user) => {
  //      const active_user_id= get_active_user(user.username)
  //       io.to(active_user_id).emit("message", {
  //         userId: user.id,
  //         username: user.username,
  //         room: user.room,
  //         text: text,
  //       });
  //       console.log('Send to only User')
  //       console.log(user)
  //     })
  //   }
  // });




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

  socket.on("deactivate_room", () => {
    //the user is deleted from array of users and a left room message displayed
    deactivate_Room(socket.id);

  });
});
}, 1000);
