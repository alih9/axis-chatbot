
import { Widget, addResponseMessage,dropMessages,renderCustomComponent,toggleInputDisabled,addUserMessage } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';
import React, { useEffect,useState} from 'react';
import Form from './Form'
import date from 'date-and-time';
import message from './message';

// import { useParams } from "react-router-dom";

// Get ID from URL

// const socket = io(process.env.REACT_APP_NODE_API);
const axios = require('axios')

function ChatBox({socket,_id}) {
  const [user, setuser] = useState({})
  const [tenant, settenant] = useState(null)
  const [room, setRoom] = useState({})
  const [roomId, setRoomId] = useState({})
  
  const [email, setemail] = useState('')
  const [roomParticipant, setRoomParticipant] = useState({})
  const [parent_message_id, setParent_message_id] = useState(0);
  const [AllMsg, setAllMsg] = useState([])
  
  // const params = useParams();
  useEffect(() => {
    toggleInputDisabled();
    renderCustomComponent(Form, { handleSubscribeForm });
    // addUserMessage('umer')
  }, []);


  useEffect(() => {
    // alert(parent_message_id)
  }, [parent_message_id]);


  useEffect(() => {
    socket.on("message", (data) => {
      if( data.room==room.id)
      {
      addResponseMessage(data.text)
      }
    });
  }, [socket,roomId]);
  
  useEffect(()=>{
socket.on("deactivate_chat",()=>{
  alert("deactivate")
  dropMessages()
  toggleInputDisabled();
  renderCustomComponent(Form, { handleSubscribeForm });
})
  },[socket])


const handleSubscribeForm = async (name,email) => {
  toggleInputDisabled();
  setemail(email)
    // const URL='http://localhost:5000/api/userdata'
    const NODE_API = process.env.REACT_APP_NODE_API
    var URL = `${NODE_API}/api/getuserdetails`
    // // alert(URL)
    const AuthStr='Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYyNTk5MTMwNywiZXhwIjoxNjI2MDc3NzA3fQ.rtQZNlGvIxkdFvlXJjU-ddIhBjXkpAEz7_x2O9bcLcE';
  
    // await axios({
    //   method: 'post',
    //   url: URL,
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'authorization': AuthStr 
    //   },
    //   data: {  tenant_id:params.id },
    //   })
    //   .then((data) => {
    //     console.log(data.tenant.email);
    //     alert(JSON.stringify(data.tenant))
    //     settenant(data.tenant);
    //    })
    //   .catch((error) =>
    //   {
    // console.error('Error:', error);
    //   });
    var today = new Date();
    var currentDate = today.toGMTString();
  

  
  URL = `${NODE_API}/api/userdata`;
  await axios({
    method: 'post',
    url: URL,
    headers: {
      'Content-Type': 'application/json',
      'authorization': AuthStr 
    },
    data: {  name: name, email: email ,tenant_id:_id, last_message_update_at:currentDate,last_message:"New Message" },
  })
    .then((data) => {
      console.log(data.data.chattingRoom.room.id);
      alert(JSON.stringify(data.data.chattingRoom.tenant))
      settenant(data.data.chattingRoom.tenant);
      socket.emit("joinRoom", { username: email, roomname: data.data.chattingRoom.room.id })
      socket.emit("add_active_user", { email: email})
      socket.emit("active_room", {tenant:data.data.chattingRoom.tenant.email, username: email, roomname: data.data.chattingRoom.room.id })

       dropMessages()
       alert(JSON.stringify(data.data.chattingRoom.room))
      setRoom(data.data.chattingRoom.room)
      setRoomId(data.data.chattingRoom.room.id)
      setRoomParticipant(data.data.chattingRoom.roomParticipant)
      setuser(data.data.chattingRoom.user)
      console.log(data.data.chattingRoom)
      if (data.data.chattingRoom.parent_msg) {
        setParent_message_id(data.data.chattingRoom.parent_msg)
        setAllMsg(data.data.chattingRoom.allMsg)
        const allmsg = data.data.chattingRoom.allMsg;
        for (let i = 0; i < allmsg.length; i++) {
          
            console.log(allmsg[i].email)
            if (allmsg[i].email === email) {
              addUserMessage(allmsg[i].message, allmsg[i].parent_message_id)
            }
            else {
              addResponseMessage(allmsg[i].message, allmsg[i].parent_message_id)
            }
          
        }
      }
      else {
        setParent_message_id(0)
      }
      
      const room_number = data.data.chattingRoom.room.id;
       const msg = `Allocated Room Number #${room_number}`;
       renderCustomComponent(message, { message:msg });
})
    .catch((error) =>
{
  addResponseMessage('Issue Happen!');
  console.error('Error:', error);
  
});
  };


  
 
  const handleNewUserMessage = async (message) => {
    // socket.emit("chat1", message);
    alert(JSON.stringify(roomId))
    socket.emit("chat", {text:message,email:tenant.email,room:room.id});
    const NODE_API = process.env.REACT_APP_NODE_API
    const URL = `${NODE_API}/api/customerchatting`
    const now = new Date();
    var currentDate=date.format(now, 'YYYY-MM-DD hh:mm:ss'); 
    currentDate = now.toGMTString();
    // alert(myDate.toLocaleString());
    const AuthStr='Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYyNTk5MTMwNywiZXhwIjoxNjI2MDc3NzA3fQ.rtQZNlGvIxkdFvlXJjU-ddIhBjXkpAEz7_x2O9bcLcE';
    const i = parent_message_id + 1;
  setParent_message_id(i)
  await axios({
    method: 'post',
    url: URL,
    headers: {
      'Content-Type': 'application/json',
      'authorization': AuthStr 
    },
    data: {  message: message, user_id: user.id ,room_id:room.id,parent_message_id:i,date:currentDate ,email:email },
  }).then(data => {
       console.log(data.data);
   
})
  }

  
  return (
    <Widget handleNewUserMessage={handleNewUserMessage}
      showTimeStamp={false}
    title="Axis Chatbot"
    subtitle="Welcome to axis chatbot"
  />
  );
}

export default ChatBox;
