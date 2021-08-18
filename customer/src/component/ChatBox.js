
import { Widget, addResponseMessage,dropMessages,renderCustomComponent,toggleInputDisabled,addUserMessage } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';
import React, { useEffect,useState} from 'react';
import Form from './Form'
import date from 'date-and-time';
import message from './message'
const axios = require('axios')

function ChatBox(props) {
  const [user, setuser] = useState({})
  const [room, setRoom] = useState({})
  const [email, setemail] = useState('')
  const [roomParticipant, setRoomParticipant] = useState({})
  const [parent_message_id, setParent_message_id] = useState(0);
  const [AllMsg, setAllMsg] = useState([])
  
  
  useEffect(() => {
    toggleInputDisabled();
    renderCustomComponent(Form, { handleSubscribeForm });
    // addUserMessage('umer')
  }, []);


  useEffect(() => {
    // alert(parent_message_id)
  }, [parent_message_id]);


  useEffect(() => {
    props.socket.on("message", (data) => {
      addResponseMessage(data.text)
    });
  }, [props.socket]);
  
  

const handleSubscribeForm = async (name,email) => {
  toggleInputDisabled();
  setemail(email)
    // const URL='http://localhost:5000/api/userdata'
    const NODE_API = process.env.REACT_APP_NODE_API
    const URL = `${NODE_API}/api/userdata`
    alert(URL)
    const AuthStr='Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYyNTk5MTMwNywiZXhwIjoxNjI2MDc3NzA3fQ.rtQZNlGvIxkdFvlXJjU-ddIhBjXkpAEz7_x2O9bcLcE';
  
  await axios({
    method: 'post',
    url: URL,
    headers: {
      'Content-Type': 'application/json',
      'authorization': AuthStr 
    },
    data: {  name: name, email: email  },
  })
    .then((data) => {
      console.log(data.data.chattingRoom.room.id);
      props.socket.emit("joinRoom", { username: email, roomname: data.data.chattingRoom.room.id })
      props.socket.emit("active_room", { username: email, roomname: data.data.chattingRoom.room.id })

       dropMessages()
      setRoom(data.data.chattingRoom.room)
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
    props.socket.emit("chat1", message);
    const NODE_API = process.env.REACT_APP_NODE_API
    const URL = `${NODE_API}/api/customerchatting`
    const now = new Date();
    const currentDate=date.format(now, 'YYYY-MM-DD HH:mm:ss');  
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
    <Widget
      
      handleNewUserMessage={handleNewUserMessage}

    title="Axis Chatbot"
    subtitle="Welcome to axis chatbot"
  />
  );
}

export default ChatBox;
