import React, { useEffect,useState } from 'react';
import { connect } from 'react-redux';
import dates from 'date-and-time';
import { conversationChanged, newMessageAdded, conversationDeleted, conversationsRequested ,updateMessagesDetails, sendMessage, updateConversation, deletedAddedConversation, updateConversationDateMessage,deleteSelectedConvsersation,messageDeleted , messageDeleteDetail} from '../../store/actions';
import ConversationSearch from '../../components/conversation/conversation-search/ConversationSearch';
import NoConversations from '../../components/conversation/no-conversations/NoConversations';
import ConversationList from '../../components/conversation/conversation-list/ConversationList';
import NewConversation from '../../components/conversation/new-conversation/NewConversation';
import ChatTitle from '../../components/chat-title/ChatTitle';
import MessageList from '../message/MessageList';
import ChatForm from '../../components/chat-form/ChatForm';
import LogoutButton from '../../components/util/LogoutButton';
import Loading from '../../components/util/Loading';
import { toast } from 'react-toastify';
import {useAuth0  } from "@auth0/auth0-react";
import {nowtime} from '../../utility/datetime';
import { useIdleTimer } from 'react-idle-timer';
import './ChatShell.scss';



const ChatShell = ({ type,conversations,user,socket, selectedConversation,messageDetails, conversationChanged, onMessageSubmitted, onMessageUpdate, sendMessage, onDeleteConversation, loadConversations, updateConversation, deletedAddedConversation,updateConversationDateMessage,deleteSelectedConvsersation,isLoading, onDeleteMessage, messageDeleteDetail }) =>
{
    const { isAuthenticated } = useAuth0();
    const [conversationRender, setconversationRender] = useState(false);
    const [activeUsers, setactiveUsers] = useState([]);
    let activeUsersTemp;
    useEffect(() => {
        loadConversations(type);
    }, [loadConversations]);

    useEffect(()=>{
        //Initial Active Users (used on reloads)
        socket.emit("get_active_customers");
        socket.on("active_customers", (data)=>{
            console.log("Initial Values",data);
            setactiveUsers(data);
        });

    }, [])

    const changeActiveUsers = (newUser)=>{
        // let index = activeUsersTemp.indexOf(newUser.room_id);
        console.log("New User and index",newUser.is_active);
        if(newUser.is_active)
        {
            console.log("ADD ACTIVE USER",newUser.room_id);
            setactiveUsers((prevState)=>{
                if(prevState.indexOf(newUser.room_id) == -1){
                    activeUsersTemp = [...prevState,newUser.room_id];
                } else {
                    activeUsersTemp = prevState;
                }
                console.log("NEW STATE-> ",activeUsersTemp);
                return activeUsersTemp;
            })
        }
         else 
        {
            console.log("REMOVE ACTIVE USER",newUser.room_id);
            setactiveUsers((prevState) =>{
                let index = prevState.indexOf(newUser.room_id);
                if(index != -1){
                    activeUsersTemp = [...prevState];
                    console.log(prevState);
                    activeUsersTemp.splice(index,1);
                } else {
                    activeUsersTemp = prevState;
                    console.log("USER NOT FOUND IN CURRENT STATE");
                }
                return activeUsersTemp;
            });    
        }
    }
 
    useEffect(()=>{
        console.log("Active Users change invoked",activeUsers);
    },[activeUsers]);
    useEffect(() => {
        console.log("SOCKET CHANGED");
        socket.on("message", (data) => {
            console.log('-------------------------------------Message Recieved',data)
           
        
            
                var today = new Date();
                var date = dates.format(today, 'DD/MM/YYYY');
                date = today.toLocaleString();
                var time = nowtime();
                date="";
                toast.success(data.text, {position: "bottom-right",autoClose: 2000,hideProgressBar: false, closeOnClick: true, });
                onMessageUpdate(data.room, data.text, true, null, false, date, time, data.msg_id, data.id)
                updateConversationDateMessage(data.room, data.text, date, time)
                setconversationRender(true)
            
            
        });
    
        socket.on("add_active_room", (data) => {
            console.log("Socket Add Active Room Event Invoked");
            // deletedAddedConversation(data.room)
            var time = nowtime();
            updateConversation(data.room, data.username,data.email ,time,data.last_message) 
            setconversationRender(true)
               
        });


        socket.on("active_customer", (data)=>{
            console.log("ADD ACTIVE CUSTOMER EVENT INVOKED",data);
            changeActiveUsers(data);
        });
       
        return ()=>{
            socket.off("add_active_cusomter")
        }
     

    }, [socket])
     
    const [searchConversation, setsearchConversation] = React.useState('')
    const [searchList, setsearchList] = React.useState(false)
    const [newsearchList, setnewSearchList] = React.useState(false)
    const [selectedConversationId, setselectedConversationId] = React.useState('')
   
    useEffect(()=>{ 
        console.log("Selected Conversation ID Changed",selectedConversation.id);
        if(Object.keys(selectedConversation).length != 0)
    {
            var count =0;
            if(selectedConversationId != '')
            {      
                    var active_chats = {
                        active_room: selectedConversation.id,
                        in_active_room: selectedConversationId
                    }
                    socket.emit(" room_activation_status",active_chats);
                    console.log(active_chats);
                    console.log("John has left this conversation ",selectedConversationId, selectedConversation.id);
                    setselectedConversationId(selectedConversation.id);
            } else {
                var active_chats = {
                    active_room: selectedConversation.id,
                    in_active_room: null
                }
                socket.emit("room_activation_status",active_chats);
                console.log("John has joined this conversation ",selectedConversation.id);
                setselectedConversationId(selectedConversation.id); 
            }
        }
        
    },[selectedConversation.id])
    
    useEffect(() => {
        setnewSearchList(conversations.filter((n)=>  n.title.includes(searchConversation) ))
        if (searchConversation.length > 0) {
            setsearchList(true)
        }
        else {
            setsearchList(false)
        }
    }, [searchConversation])

    const DelMsg = (message,isMyMessage)=>{
        console.log("Function Called");
        console.log(user);
        console.log(message,isMyMessage);
        onDeleteMessage(message);
        if(isMyMessage)
        {
            socket.emit("delete_message", message);
        }
    }

    const joinRoom = (conversationId) => {
        socket.emit("joinRoom", { username: user.email, roomname: conversationId })
    }
    const disconnect = (conversationId) => {
        socket.emit("disconect");
    }

    const SendLiveMessage = (message,conversationId,id) => {
        console.log("SEND LIVE MESSAGE");
        socket.emit("chat", {text:message, email:selectedConversation.email, room:conversationId, id: id});
        //    socket.emit("chat1", message);
    }

    const handleOnIdle = event => {
        console.log('user is idle')
        console.log('last active', getLastActiveTime())
        if(selectedConversation){
            console.log("Rejoin Selected Conversation here",selectedConversation.id);
            joinRoom(selectedConversation.id);
        }
      }
    
    //   const handleOnActive = event => {
    //     console.log('user is active', event)
    //     console.log('time remaining', getRemainingTime())
    //   }
      
      const { getRemainingTime, getLastActiveTime } = useIdleTimer({
        timeout: 30000,
        onIdle: handleOnIdle,
        debounce: 2000
      })
    
    let conversationContent = (
        <>
            <NoConversations></NoConversations>
        </>
    );

    if (selectedConversation?.id) {
        alert('run')
        conversationContent = (
            <>
                <MessageList conversationId={selectedConversation.id} selectedConversation={selectedConversation} DelMsg={DelMsg}/>
            </>
        );
    }

    return (
        <>     
        <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
            integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
            crossOrigin="anonymous"
            />               
          {/* {isAuthenticated? <LogoutButton/> : '' } */}
        <div id="chat-container">
            <ConversationSearch
                searchConversation={searchConversation}
                setsearchConversation={setsearchConversation}
                conversations={conversations}
            />
            {searchList && <ConversationList
                onConversationItemSelected={conversationChanged}
                joinRoom={joinRoom}
                socket={socket}
                disconnect={disconnect}
                conversations={newsearchList}
                selectedConversation={selectedConversation} 
                conversationRender={conversationRender}
                activeUsers = {activeUsers}
                setconversationRender={setconversationRender} />}

            {!searchList && <ConversationList
                onConversationItemSelected={conversationChanged}
                joinRoom={joinRoom}
                socket={socket}
                disconnect={disconnect}
                conversations={conversations}
                selectedConversation={selectedConversation}
                conversationRender={conversationRender}
                activeUsers = {activeUsers}
                setconversationRender={setconversationRender} />}

            <NewConversation />
            {isLoading ? <div id='loading-layout'><div id='loading-content'><Loading/></div></div>
            :
            <>
                <ChatTitle 
                    selectedConversation={selectedConversation}
                    onDeleteConversation={onDeleteConversation}
                    deletedAddedConversation={deletedAddedConversation}
                    deleteSelectedConvsersation={deleteSelectedConvsersation}
                    messageDeleteDetail={messageDeleteDetail}
                    socket={socket}
                    user={user}
                />
                {conversationContent}
                <ChatForm 
                selectedConversation={selectedConversation}
                user={user}
                onMessageSubmitted={onMessageSubmitted}
                onMessageUpdate={onMessageUpdate}
                messageDetails={messageDetails}
                sendMessage={sendMessage}
                SendLiveMessage={SendLiveMessage}
                updateConversationDateMessage={updateConversationDateMessage}
                />
            </>
            }
            </div>
            </>
    );
}
        
const mapStateToProps = state => {
    return {
        conversations: state.conversationState.conversations,
        user: state.usersState.userDetails,
        selectedConversation: state.conversationState.selectedConversation,
        messageDetails: state.messagesState.messageDetails,
        isLoading: state.conversationState.isLoading    
    };
};    
  


const mapDispatchToProps = dispatch => ({
    conversationChanged: conversationId => dispatch(conversationChanged(conversationId)),
    onMessageSubmitted: (messageText, date , time) => { dispatch(newMessageAdded(messageText, date , time)); },
    onMessageUpdate: (conversationId, messages, hasMoreMessages, lastMessageId, isMyMessage, date, time, msg_id, id) => { dispatch(updateMessagesDetails(conversationId, messages, hasMoreMessages, lastMessageId, isMyMessage, date, time, msg_id, id)); },
    sendMessage: (conversationId, messages, email) => { dispatch(sendMessage(conversationId, messages, email)); },
    updateConversation: (conversationId,username, email,time,last_message) => { dispatch(updateConversation(conversationId,username, email,time,last_message)) },
    deletedAddedConversation: (conversationId) => { dispatch(deletedAddedConversation(conversationId)) },
    deleteSelectedConvsersation:()=>{dispatch(deleteSelectedConvsersation())},
    onDeleteConversation: () => { dispatch(conversationDeleted()); },
    onDeleteMessage: (message)=> {dispatch(messageDeleted(message));},
    messageDeleteDetail:(room_id)=>{dispatch(messageDeleteDetail(room_id))},
    loadConversations: (type) => { dispatch(conversationsRequested(type))},
    updateConversationDateMessage: (conversationId, messages, date , time) => { dispatch(updateConversationDateMessage(conversationId, messages, date , time)) }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChatShell);