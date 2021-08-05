import React, {useState, useEffect} from 'react';
import ConversationSearch from '../ConversationSearch';
import ConversationListItem from '../ConversationListItem';
import Toolbar from '../Toolbar';
import ToolbarButton from '../ToolbarButton';
import './ConversationList.css';
import { Backdrop } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { messageAction } from '../../Reducer/actions/message'

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: 'blue',
  },
}));
export default function ConversationList(props) {
  const classes = useStyles();
  const [conversations, setConversations] = useState([]);
  const [upcomingconversations, setupcomingconversations] = useState([]);
  const [upcomingconversationexist, setupcomingconversationexist] = useState(true);
  
  

  const upcon = useSelector(state => state.message.upcomingconversations);
  const upconlist = useSelector(state => state.message.upcomingconversationlist);
  // console.log('conversation->',upcon);
  const [didLoadConversionList, setdidLoadConversionList] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    getConversations()
  },[])


  useEffect(() => {
    props.socket.on("add_active_room", (data) => {
      const newConversation= [{
        photo: 'https://randomuser.me/api/portraits/women/29.jpg',
        name: `${data.username}`,
        text: 'Hello world! This is a long message that needs to be truncated.',
        chat_room_id: data.room,
        
      }]

      var temp_conversion = upconlist;
      temp_conversion = temp_conversion.filter((p_user) => p_user.name != data.username)
      console.log('temp',temp_conversion)
      setConversations([...temp_conversion])
      dispatch(messageAction.setconversationlist({ list: temp_conversion }));


      if (temp_conversion.length != 0) {
        console.log('upcon yes->', upcon)
        console.log('upcomingconversations yes->', upcomingconversations)
        console.log('newConversation yes->', newConversation)
        
        dispatch(messageAction.setconversation({ msg: newConversation }));
        setupcomingconversations([...upcomingconversations, ...newConversation])
       
      }
      // console.log(upcomingconversations)
    });    
  }, [props.socket,upconlist])

  
  const getConversations = async () => {
    const URL='http://localhost:5000/api/show_all_user_chat'
    const AuthStr='Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYyNjE3Mjk1NiwiZXhwIjoxNjI2MjU5MzU2fQ.aPffoniocXBXZI-l7XbQsQ5UbBNofBjfJglne65d1RA';
   await fetch(URL, { 
    method: 'GET', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
      'authorization': AuthStr 
    },
  })
  .then(response => response.json())
     .then(data => {
    let newConversations = data.chat.map(result => {
      const user = result.user;
      return {
        photo: 'https://randomuser.me/api/portraits/women/29.jpg',
        name: `${result.chatRoom.room_name}`,
        text: 'Hello world! This is a long message that needs to be truncated.',
        chat_room_id: result.chatRoom.id,
        user:user
      };
    });
       dispatch(messageAction.setconversationlist({ list: newConversations }));
       setConversations([...conversations, ...newConversations])
       setdidLoadConversionList(true);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
  }


    return (
      <div className="conversation-list" style={{ height: "900px" }}>
        <Toolbar
          title="Messenger"
          leftItems={[
            <ToolbarButton key="cog" icon="ion-ios-cog" />
          ]}
          rightItems={[
            <ToolbarButton key="add" icon="ion-ios-add-circle-outline" />
          ]}
        />
        <ConversationSearch />

        {!didLoadConversionList &&
           <Backdrop className={classes.backdrop} open='true' >
           <CircularProgress color="inherit" />
         </Backdrop>}

        
        {didLoadConversionList && <div>
          {    upcon.map(conversation =>
              <ConversationListItem openUserConversation={props.openUserConversation}
                key={conversation.name}
                data={conversation}
              />
            )}
          {conversations.map(conversation =>
              <ConversationListItem openUserConversation={props.openUserConversation}
                key={conversation.name}
                data={conversation}
              />
            )
          }
        </div>
        }
      </div>
    );
}