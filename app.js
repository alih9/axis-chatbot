const Joi = require('@hapi/joi');
const { validate } = require('@hapi/joi/lib/types/symbol');
const express = require('express');
const app = express();
const cors = require('cors');

const path = require('path');
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
app.use(express.urlencoded({ extended: true }));
app.use(auth);                         //authorization
app.use(errorauth);                    //in case of any error

// Routes
app.use('/api', RouteIndex);
app.get('/', (req, res) => {
  res.send('Hello World');
})



const port = process.env.PORT;
console.log(process.env.PORT)
var host = app.listen(port, () => console.log(`Listening to the port ${port}`));



const color = require("colors");
const { get_user_socketid, join_user, deactivate_Room, deactivate_User, add_active_users, get_active_customers, get_room, get_participants_emails } = require("./controller/SocketUserController");
const socket = require("socket.io");
const io = socket(host);
setTimeout(() => {


  //initializing the socket io connection 
  io.on("connection", (socket) => {
    console.log('----------------->Start the Connection of the socket IO')


    socket.on("add_active_user", async (email) => {
      console.log(`----------------->Add active User ${email.email}`)

      //gets the room user and the message sent
      const active_user = await add_active_users(socket.id, email.email, socket);
      console.log('----------------->Added Active User', active_user);
    });

    socket.on("remove_active_user", async (email) => {
      console.log("NEW ROOM EVENT RECEIVED");
      deactivate_User(email.email);
      console.log('---------------->User Socket Deactivated: ', email);
    })

    //for a new user joining the room
    socket.on("joinRoom", async ({ username, roomname }) => {

      //* create user
      console.log(`----------------->User ${username} joining the room ${roomname}`)
      const p_user = await join_user(username, roomname);
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
    socket.on("active_room", async (user) => {
      //gets the room user and the message sent
      console.log('--------------------------------------user ---->check', user)

      const p_user = await get_user_socketid(user.tenant);
      if (p_user) {
        console.log('--------------------------------------Add active ROOM executed')
        io.to(p_user.socket_id).emit("add_active_room", {
          userId: p_user.socket_id,
          email:user.email,
          username: user.username,
          room: user.roomname,
          last_message:user.last_message
        });

      }
      else {
        console.log('User not Active')
      }
    });

    //Show active users on client side functionality
    socket.on("active_customer", async (data) => {
      console.log("ACTIVE CUSTOMER EVENT INVOKED", data);
      const p_user = await get_user_socketid(data.tenant_email);
      console.log("ACTIVE CUSTOMER EVENT INVOKED INSIDE APP.JS");
      console.log(p_user);
      // if(!data.is_active && p_user){
      //   deactivate_User(p_user.socket_id);
      // }
      if (p_user) {
        socket.to(p_user.socket_id).emit("active_customer", {
          room_id: data.room_id,
          is_active: data.is_active
        })
      }
    })

    socket.on("get_active_customers", () => {
      var user_arr = [];
      console.log("---------------GET ACTIVE CUSTOMER EVENT INVOKED----------------");
      get_active_customers()
      .then((data)=>{
        const promise = data.map(async (user)=>{ 
          console.log("------THIS IS THE MAP FUNCTION -------",user.email); 
          await get_room(user.email)
          .then((data)=>{
            console.log("This is the mapped data",data);
            user_arr.push(data.room_id);
          })
        })
        Promise.all(promise).then(()=>{
          console.log(promise, user_arr);
          socket.emit("active_customers",user_arr);
        })
      })
    })



    //user sending message
    socket.on("chat", async (user) => {
      //gets the room user and the message sent
      console.log('Chatting----------------------------->', user)
      const activeuser = await get_user_socketid(user.email);
      console.log('Sending message', activeuser)
      if (activeuser) {
        socket.to(user.room).emit("message", {
          userId: activeuser.socket_id,
          username: activeuser.email,
          room: user.room,
          text: user.text,
          msg_id: user.msg_id,
          id: user.id
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

    socket.on("delete_message", (data) => {
      socket.to(data.room_id).emit("delete_customer_message", data);
    });

    socket.on("room_activation_status", (active_chats) => {
      console.log("active_room socket event response");
      if (active_chats.in_active_room != null) {
        socket.to(active_chats.in_active_room).emit("tenant_left");
        socket.to(active_chats.active_room).emit("tenant_joined");
      } else {
        socket.to(active_chats.active_room).emit("tenant_joined");
      }
    })

    socket.on("disconnect",(s)=>{
      console.log("TERMINATE(DISCONNECTED)", s);
    });

    socket.on("disconnecting", async() => {
      if([...socket.rooms][1] != undefined){
        room_id = [...socket.rooms][1];
      }
      console.log("ROOM ID and is ", socket.rooms);
      //Get Tenant's and users email to dispatch event
      var room_participants = await get_participants_emails(room_id);
      var tenant_email, customer_email;
      console.log("DISCONNECTING", room_participants);
      for(let i=0;i<room_participants.length;i++)
      {
        if(room_participants[i].is_tenant == true ){
          tenant_email = room_participants[i].email;
        } else {
          customer_email = room_participants[i].email;
        }
      }
      const p_user = await get_user_socketid(tenant_email);
      console.log(room_participants);
      console.log("P USER",p_user);
      if (p_user) {
        socket.to(p_user.socket_id).emit("active_customer", {
          room_id: room_id,
          is_active: false
        })
      } 
      deactivate_User(customer_email);

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