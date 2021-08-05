import ConversationList from '../ConversationList';
// import MessageList from '../MessageList';
import React, {useEffect, useState,useRef} from 'react';
import Compose from '../Compose';
import Toolbar from '../Toolbar';
import ToolbarButton from '../ToolbarButton';
import Message from '../Message';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import './MessageList.css';
import './Messenger.css';
import axios from 'axios'
import Cookies from "js-cookie"

import { to_Decrypt, to_Encrypt } from "../../hooks/aes";
import { processAction } from '../../Reducer/actions/process'
import { messageAction } from '../../Reducer/actions/message'


export default function Messenger(props) {
  
  const [messages, setMessages] = useState([]);
  var tmpmsg = [];
  const useremail = useSelector(state => state.user.email);   // alert(useremail)
  var room_id = useSelector(state => state.message.room_id);
  var new_msg = useSelector(state => state.message.upcomingmessages);

  var count = useSelector(state => state.message.count);
  // alert(count)
  const [MY_USER_ID, setMY_USER_ID] = useState(useremail)   // alert(MY_USER_ID)
  const [startMessenger, setStartMessenger] = React.useState(false);
  let i = 0;
  let newMessages = [];
  let previousMsg = {};
  const [chatroom_id, setchatroom_id] = useState('')
  const [first, setfirst] = useState(true)
  const [firstsetcount,setfirstsetcount]=useState(true)
  const divRef = useRef(null);
  const dispatch = useDispatch();
  const dispatchProcess = (encrypt, msg, cipher) => {
    dispatch(processAction.msg({ encrypt, msg, cipher }));
  };

  useEffect(() => {
    if (first) {
      dispatch(messageAction.setmessagenull());
      setfirst(false)
    }
  });

  useEffect(() => {
    divRef.current.scrollIntoView({ behavior: 'smooth' });
  });
  useEffect(() => {
    props.socket.on("message", (data) => {
      // console.log('Data ROOM', data.room)
      // console.log('CHAT ROOM', room_id)
      
      if (data.room == room_id) {
        var  c = count;
        c += 1;
        console.log('-------------------->', count);
    alert(`c after ${count}`)
        dispatch(messageAction.increment());
        
    alert(`c ${count}`)
        const msg = {
          id: c,
          author: data.username,
          message: data.text,
          timestamp: new Date().getTime()
        }
        let currentMoment = moment(msg.timestamp);
        let startsSequence = true;
        let prevBySameAuthor = data.username === previousMsg.author;
        let endsSequence = true;
        let showTimestamp = true;
    
        let previousMoment = moment(previousMsg.timestamp);
        let previousDuration = moment.duration(currentMoment.diff(previousMoment));
    
        if (prevBySameAuthor && previousDuration.as('hours') < 1) {
          startsSequence = false;
        }
        if (previousDuration.as('hours') < 1) {
          showTimestamp = false;
        }
        previousMsg = msg;
        newMessages.push(
          <Message
            key={c}
            isMine={false}
            startsSequence={startsSequence}
            endsSequence={false}
            showTimestamp={showTimestamp}
            data={msg}
          />
        );

        dispatch(messageAction.setmessage({newmsg: newMessages}));
        // console.log(new_msg)
        // console.log('------------New Message')
        // console.log(newMessages)
        
      }
      });
    
  }, [props.socket,room_id])


  useEffect(() => {
    // console.log('--=>Message Useeffect')
    console.log('new msg in messenger',new_msg)
    // alert(`use Effect ${new_msg}`);

  }, [new_msg])

  useEffect(() => {
    // console.log('--=>Message Useeffect')
    // console.log(messages)
    tmpmsg.push([...messages])
  }, [messages])



  
  const sendMessage = (msg) => {
  var  c = count;
    c += 1;
    // alert(`count ${count}`)
    dispatch(messageAction.increment());
    

    // alert(`c ${count}`)
    // setTimeout(() => { alert(`After time ,count ${count}`)},3000)
    var tempMessages = [
      {
        id: c,
        author: MY_USER_ID,
        message: msg,
        timestamp: new Date().getTime()
      },]
    // alert(c);
    props.socket.emit("chat1", msg);
    let currentMoment = moment(tempMessages.timestamp);
    let startsSequence = true;
    let prevBySameAuthor = MY_USER_ID === previousMsg.author;
    let endsSequence = true;
    let showTimestamp = true;
  
    let previousMoment = moment(previousMsg.timestamp);
    let previousDuration = moment.duration(currentMoment.diff(previousMoment));
  
    if (prevBySameAuthor && previousDuration.as('hours') < 1) {
      startsSequence = false;
    }
    if (previousDuration.as('hours') < 1) {
      showTimestamp = false;
    }

    previousMsg = tempMessages[0];
    newMessages.push(
      <Message
        key={c}
        isMine={true}
        startsSequence={startsSequence}
        endsSequence={false}
        showTimestamp={showTimestamp}
        data={tempMessages[0]}
      />
    );
    dispatch(messageAction.setmessage({newmsg: newMessages}));
  
    // console.log('------------New Message')
    // console.log(newMessages)
    
    
    const token = Cookies.get('token');
    const AuthStr = 'Bearer ' + token;
    const URL = 'http://localhost:5000/api/tenantchatting'

    const j = 1;

    const a =  axios({
      method: 'post',
      url: URL,
      headers: {
        'Content-Type': 'application/json',
        'authorization': AuthStr
      },
      data: { message: msg, room_id: chatroom_id, parent_message_id: j, email: useremail },
    })
      .then(data => {
        // console.log(data.data);
   
      })
     
      
  }


  const renderMessages = () => {
    
    let messageCount = messages.length;
    let tempMessages = [];
    while (i < messageCount) {

      let previous = messages[i - 1];
      let current = messages[i];
      let next = messages[i + 1];
      let isMine = current.author === MY_USER_ID;
      let currentMoment = moment(current.timestamp);
      let prevBySameAuthor = false;
      let nextBySameAuthor = false;
      let startsSequence = true;
      let endsSequence = true;
      let showTimestamp = true;
      if (previous) {
        let previousMoment = moment(previous.timestamp);
        let previousDuration = moment.duration(currentMoment.diff(previousMoment));
        prevBySameAuthor = previous.author === current.author;
        if (prevBySameAuthor && previousDuration.as('hours') < 1) {
          startsSequence = false;
        }
        if (previousDuration.as('hours') < 1) {
          showTimestamp = false;
        }
      }
      if (next) {
        let nextMoment = moment(next.timestamp);
        let nextDuration = moment.duration(nextMoment.diff(currentMoment));
        nextBySameAuthor = next.author === current.author;

        if (nextBySameAuthor && nextDuration.as('hours') < 1) {
          endsSequence = false;
        }
      }
      previousMsg = current;
      tempMessages.push(
        <Message
          key={i}
          isMine={isMine}
          startsSequence={startsSequence}
          endsSequence={endsSequence}
          showTimestamp={showTimestamp}
          data={current}
        />
      );

      // Proceed to the next message.
      i += 1;
      
      // alert(i);
    }

    if (firstsetcount) {
      dispatch(messageAction.setCount({ c: i }));
      setfirstsetcount(false)
    }
    // alert(count)
    return tempMessages;
  }
  
  const openUserConversation = async (chatrm_id) => {
    if (room_id != 0) {
      props.socket.emit("disconect");
    }
    setchatroom_id(chatrm_id)
    dispatch(messageAction.setRoom({ room_id: chatrm_id }));
    
    alert(useremail)
    // alert(room_id)
    // alert(chatrm_id)

    const URL = 'http://localhost:5000/api/getmessage'
    const token = Cookies.get('token');
    const AuthStr='Bearer '+token;
    await fetch(URL, { 
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
        'authorization': AuthStr 
      },
      body:JSON.stringify({'chat_room_id':chatrm_id,'email':useremail})
    })
    .then(response => response.json())
      .then(async (data) => {
         
        
        
    const msg= await data.msg.map(result => {
   
        return {
          id: result.id,
          author: result.email,
          message: result.message,
          timestamp: result.createdAt
        
        
        };
      });
        // console.log(msg);
       
     await setMessages(msg)
     props.socket.emit("joinRoom", { username: useremail, roomname: chatrm_id })
    

    })
    .catch((error) => {
      console.error('Error:', error);
    });

    
    setStartMessenger(true);
  }



  const title = '';
  const leftItems = '';
  const rightItems = '';
  

    return (
    
    
        <div className="messenger">
      
      
      
        {startMessenger && <div className="toolbar" style={{ margin: "0px" }}>
          <div className="left-items">{leftItems}</div>
          <h1 className="toolbar-title"></h1>
          <div className="right-items">{rightItems}</div>
        </div>}

         
        
        
        {startMessenger && 
          
          <div className="toolbar" style={{margin: "0px"}}>
          <Compose sendMessage={sendMessage} rightItems={[
              <ToolbarButton key="photo" icon="ion-ios-camera" />,
              <ToolbarButton key="image" icon="ion-ios-image" />,
              <ToolbarButton key="audio" icon="ion-ios-mic" />,
              <ToolbarButton key="money" icon="ion-ios-card" />,
              <ToolbarButton key="games" icon="ion-logo-game-controller-b" />,
              <ToolbarButton key="emoji" icon="ion-ios-happy" />
            ]} />
         </div>  }
     

        <div className="scrollable sidebar">
          <ConversationList socket={props.socket} openUserConversation={openUserConversation} />
        </div>

        <div className="scrollable content">
          {/* <MessageList startMessenger={startMessenger} allmessages={allmessage}/> */}

          <div className="message-list" >
        <Toolbar
          title="Conversation Title"
          rightItems={[
            <ToolbarButton key="info" icon="ion-ios-information-circle-outline" />,
            <ToolbarButton key="video" icon="ion-ios-videocam" />,
            <ToolbarButton key="phone" icon="ion-ios-call" />
          ]}
        />

        {startMessenger &&
          <>
              <div className="message-list-container">
                <div>{renderMessages()}</div>
             
                <div>
                {  new_msg.map((n)=>(

                  <div key={n.id}>
                    {n}</div>
      ))}
            </div></div>
          {/* <Compose sendMessage={sendMessage} rightItems={[
              <ToolbarButton key="photo" icon="ion-ios-camera" />,
              <ToolbarButton key="image" icon="ion-ios-image" />,
              <ToolbarButton key="audio" icon="ion-ios-mic" />,
              <ToolbarButton key="money" icon="ion-ios-card" />,
              <ToolbarButton key="games" icon="ion-logo-game-controller-b" />,
              <ToolbarButton key="emoji" icon="ion-ios-happy" />
            ]} /> */}
          </>}
<div ref={divRef}></div>
            
          </div>
        {!startMessenger && <h1 className="message" style={{ alignItems: "center" , marginTop:"30%" }}> Open to start Conversation
        </h1>}
      

        </div>
      </div>
    );
}