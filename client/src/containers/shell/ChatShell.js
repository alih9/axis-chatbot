import React, { useEffect,useState } from 'react';
import { connect } from 'react-redux';
import dates from 'date-and-time';
import { conversationChanged, newMessageAdded, conversationDeleted, conversationsRequested ,updateMessagesDetails, sendMessage, updateConversation, deletedAddedConversation, updateConversationDateMessage, messageDeleted} from '../../store/actions';
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
import './ChatShell.scss';



const ChatShell = ({ type,conversations,user,socket, selectedConversation,messageDetails, conversationChanged, onMessageSubmitted, onMessageUpdate, sendMessage, onDeleteConversation, loadConversations, updateConversation, deletedAddedConversation,updateConversationDateMessage, isLoading, onDeleteMessage }) =>
{
    const { isAuthenticated } = useAuth0();
    const [conversationRender, setconversationRender] = useState(false)
    useEffect(() => {
        loadConversations(type);
    }, [loadConversations]);

 
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
                onMessageUpdate(data.room, data.text, true, null, false, date, time)
                updateConversationDateMessage(data.room, data.text, date, time)
                setconversationRender(true)
            
            
        });
    
        socket.on("add_active_room", (data) => {
            console.log("Socket Add Active Room Event Invoked");
            // deletedAddedConversation(data.room)
            var time = nowtime();
            updateConversation(data.room, data.username ,time) 
            setconversationRender(true)
               
        });

     

    }, [socket])
     
    const [searchConversation, setsearchConversation] = React.useState('')
    const [searchList, setsearchList] = React.useState(false)
    const [newsearchList, setnewSearchList] = React.useState(false)
   
   
    
    useEffect(() => {
        setnewSearchList(conversations.filter((n)=>  n.title.includes(searchConversation) ))
        if (searchConversation.length > 0) {
            setsearchList(true)
        }
        else {
            setsearchList(false)
        }
    }, [searchConversation])
    
    const joinRoom = (conversationId) => {
        socket.emit("joinRoom", { username: user.email, roomname: conversationId })
    }
    const disconnect = (conversationId) => {
        socket.emit("disconect");
    }

    const SendLiveMessage = (message,conversationId) => {
        socket.emit("chat", {text:message,email:selectedConversation.title,room:conversationId});
        //    socket.emit("chat1", message);
    }
    
    let conversationContent = (
        <>
            <NoConversations></NoConversations>
        </>
    );

    if (selectedConversation) {
        console.log(onDeleteMessage);
        conversationContent = (
            <>
                <MessageList conversationId={selectedConversation.id} selectedConversation={selectedConversation} DeleteMessage={onDeleteMessage}/>
            </>
        );
    }

    return (
        <>                    
          {isAuthenticated? <LogoutButton/> : '' }
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
                setconversationRender={setconversationRender} />}

            {!searchList && <ConversationList
                onConversationItemSelected={conversationChanged}
                joinRoom={joinRoom}
                socket={socket}
                disconnect={disconnect}
                conversations={conversations}
                selectedConversation={selectedConversation}
                conversationRender={conversationRender}
                setconversationRender={setconversationRender} />}

            {/* {isLoading ? <div id='loading-layout'><div id='loading-content'><Loading/></div></div>:null} */}
            
            <NewConversation />
            {isLoading ? <div id='loading-layout'><div id='loading-content'><Loading/></div></div>
            :
            <>
                <ChatTitle 
                    selectedConversation={selectedConversation}
                    onDeleteConversation={onDeleteConversation}
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
    onMessageUpdate: (conversationId, messages, hasMoreMessages, lastMessageId, isMyMessage, date,time) => { dispatch(updateMessagesDetails(conversationId, messages, hasMoreMessages, lastMessageId, isMyMessage, date,time)); },
    sendMessage: (conversationId, messages, email) => { dispatch(sendMessage(conversationId, messages, email)); },
    updateConversation: (conversationId, email,time) => { dispatch(updateConversation(conversationId, email,time)) },
    deletedAddedConversation: (conversationId) => { dispatch(deletedAddedConversation(conversationId)) },
    onDeleteConversation: () => { dispatch(conversationDeleted()); },
    onDeleteMessage: (message)=> {dispatch(messageDeleted(message));},
    loadConversations: (type) => { dispatch(conversationsRequested(type))},
    updateConversationDateMessage: (conversationId, messages, date , time) => { dispatch(updateConversationDateMessage(conversationId, messages, date , time)) }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChatShell);