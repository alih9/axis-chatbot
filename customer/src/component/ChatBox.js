
import { Widget, addResponseMessage,dropMessages,renderCustomComponent,toggleInputDisabled,addUserMessage,deleteMessages } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';
import React, { useEffect,useState} from 'react';
import Form from './Form'
import date from 'date-and-time';
import message from './message';
import { useLocation} from "react-router-dom";
import  axios from 'axios'
import { useIdleTimer } from 'react-idle-timer'


function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}


function ChatBox({socket}) {
  const [user, setuser] = useState({})
  const [tenant, settenant] = useState(null)
  const [room, setRoom] = useState({})
  const [roomId, setRoomId] = useState({})
  
  const [email, setemail] = useState('')
  const [roomParticipant, setRoomParticipant] = useState({})
  const [parent_message_id, setParent_message_id] = useState(0);
  const [AllMsg, setAllMsg] = useState([])
  
  let query = useQuery();
  const tenant_id=query.get("tenant_id")

  useEffect(() => {
    toggleInputDisabled();
    renderCustomComponent(Form, { handleSubscribeForm });
  }, []);


  useEffect(() => {
    socket.on("message", (data) => {
      console.log(data);
      if( data.room==room.id)
      {
      addResponseMessage(data.text, data.id)
      }
    });

    socket.on("delete_customer_message", (data) => {  
      console.log(data);
      console.log(data.messageText, data.id);
      deleteMessages(data.messageText,data.id);
    });

    socket.on("tenant_left", ()=>{
      if(tenant)
      renderCustomComponent(message, {message: `${tenant.name} has left the room`});
      console.log("TENANT LEFT");
    });

    socket.off("tenant_joined").on("tenant_joined", ()=>{
      if(tenant)
      renderCustomComponent(message, {message: `${tenant.name} has joined the room`});
      console.log("TENANT JOINED");
    });

  }, [socket,roomId]);
  
  useEffect(()=>{
socket.on("deactivate_chat",()=>{
  dropMessages()
  toggleInputDisabled();
  renderCustomComponent(message, { message:"Your Query Has been resolved. If you have any other query you can resquest again" });
  renderCustomComponent(Form, { handleSubscribeForm });
})
  },[socket])


const handleSubscribeForm = async (name,email,messagetmp) => {
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
    data: { name: name, email: email,message:messagetmp ,tenant_id:tenant_id, last_message_update_at:currentDate,last_message:messagetmp },
  })
    .then((data) => {
      console.log(data.data.chattingRoom.room.id);
      //alert(JSON.stringify(data.data.chattingRoom.tenant))
      settenant(data.data.chattingRoom.tenant);
      socket.emit("joinRoom", { username: email, roomname: data.data.chattingRoom.room.id })
      socket.emit("add_active_user", { email: email, is_active: 1})
      socket.emit("active_room", {tenant:data.data.chattingRoom.tenant.email, username: name,email:email, roomname: data.data.chattingRoom.room.id ,last_message:messagetmp })
      socket.emit("active_customer",{tenant_email: data.data.chattingRoom.tenant.email, room_id: data.data.chattingRoom.room.id, is_active: true});
       dropMessages()
       //alert(JSON.stringify(data.data.chattingRoom.room))
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
          
            console.log(allmsg[i])

            if (allmsg[i].email === email) 
            {
              addUserMessage(allmsg[i].message+"", allmsg[i].parent_message_id)
            }
            else 
            {
              if(allmsg[i].deleted_at == null)
              addResponseMessage(allmsg[i].message+"", allmsg[i].parent_message_id)
            }
        }
      }
      else 
      {
        setParent_message_id(0)
        addUserMessage(messagetmp)
      }
      const tenant_name = data.data.chattingRoom.tenant.name;
      console.log("Tenant-Name",tenant_name)
      const msg = `Conversation has been connected to ${tenant_name}`;
       renderCustomComponent((props) => {
        return (
            <div className="wrapper">
                {props.message}
             </div> 
    );
    }, { message:msg });
      // 
      // const msg = `Conversation has been connected to ${tenant_name}`;
      //  renderCustomComponent(message, { message:msg });
})
    .catch((error) =>
{
  addResponseMessage('Issue Happen!');
  console.error('Error:', error);
});
  };

  const handleNewUserMessage = async (message) => {
    // socket.emit("chat1", message);
    // alert(JSON.stringify(roomId))
    //socket.emit("chat", {text:message,email:tenant.email,room:room.id});
    const NODE_API = process.env.REACT_APP_NODE_API
    const URL = `${NODE_API}/api/customerchatting`
    const now = new Date();
    var currentDate=date.format(now, 'YYYY-MM-DD hh:mm:ss'); 
    currentDate = now.toGMTString();
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
      //  alert(tenant.email)
       socket.emit("chat", {text:message,email:tenant.email,room:room.id, msg_id: data.data.message.id, id: data.data.parent_message_id});   
})
  }

  const activeCustomerEvent = (isActive)=>{
    socket.emit("active_customer",{tenant_email: tenant.email, room_id: roomId, is_active: isActive});
    if(isActive)
    {
      console.log("Active");
      socket.emit("add_active_user", { email: email, is_active: 1});
    }
    else
    { 
      console.log("not Active");
      socket.emit("add_active_user", { email: email, is_active: 0});
    }
  }

  const handleOnIdle = event => {
    console.log('user is idle',tenant);
    console.log(email,roomId);
    if(email && roomId){
      console.log("Email & RoomId on Idle event",email,roomId);
      socket.emit("joinRoom", { username: email, roomname: roomId})
      socket.emit("remove_active_user", {email: email})
      if(tenant)
        activeCustomerEvent(false)  
      //socket.emit("active_customer",{tenant_email: tenant.email, room_id: roomId, is_active: false});
    }
    console.log('last active', getLastActiveTime())
  }

  const handleOnActive = event => {
    console.log('user is active', event)
    console.log('time remaining', getRemainingTime())
    console.log(tenant);
    if(roomId && tenant){
      socket.emit("joinRoom", { username: email, roomname: roomId})
      activeCustomerEvent(true);
      //socket.emit("active_customer",{tenant_email: tenant.email, room_id: roomId, is_active: true});
    }
    
  }
  
  const { getRemainingTime, getLastActiveTime } = useIdleTimer({
    timeout: 25000,
    onIdle: handleOnIdle,
    onActive: handleOnActive,
    debounce: 2000
  })

  
  return (
    <Widget handleNewUserMessage={handleNewUserMessage}
      showTimeStamp={false}
    title="Axis Chatbot"
    subtitle="Welcome to axis chatbot"
  />
  );
}

export default ChatBox;
