import React, { useEffect,useState } from 'react';
import { connect } from 'react-redux';
import dates from 'date-and-time';
import { conversationChanged, newMessageAdded, conversationDeleted, conversationsRequested ,updateMessagesDetails, sendMessage, updateConversation, deletedAddedConversation, updateConversationDateMessage} from '../../store/actions';
import ConversationSearch from '../../components/conversation/conversation-search/ConversationSearch';
import NoConversations from '../../components/conversation/no-conversations/NoConversations';
import ConversationList from '../../components/conversation/conversation-list/ConversationList';
import NewConversation from '../../components/conversation/new-conversation/NewConversation';
import ChatTitle from '../../components/chat-title/ChatTitle';
import MessageList from '../message/MessageList';
import ChatForm from '../../components/chat-form/ChatForm';

import './ChatShell.scss';

import io from "socket.io-client";
const socket = io.connect('/');
const ChatShell = ({ conversations, selectedConversation,messageDetails, conversationChanged, onMessageSubmitted, onMessageUpdate, sendMessage, onDeleteConversation, loadConversations, updateConversation, deletedAddedConversation,updateConversationDateMessage }) =>
{
    const [conversationRender, setconversationRender] = useState(false)
    useEffect(() => {
        loadConversations();
    }, [loadConversations]);

 
    useEffect(() => {
        socket.on("message", (data) => {
            console.log('-------------------------------------Data undefined',data)
            alert(JSON.stringify(data))
            
            // alert(date.text)
                var today = new Date();
                // currentDate = now.toGMTString();
            
                var date = dates.format(today, 'DD/MM/YYYY');
                var time = dates.format(today, 'hh:mm:ss ');
                date = today.toLocaleString();
                time = "";
                onMessageUpdate(data.room, data.text, false, null, false, date, time)
                time = date;
                
                updateConversationDateMessage(data.room, data.text, date, time)
                setTimeout(updateConversationDateMessage(data.room, data.text, date, time),500)
                
            
        });
    
        socket.on("add_active_room", (data) => {
            deletedAddedConversation(data.room)
            updateConversation(data.room, data.username)
            setconversationRender(true)

          });    

    }, [socket])
     
    const [searchConversation, setsearchConversation] = React.useState('')
    const [searchList, setsearchList] = React.useState(false)
    const [newsearchList, setnewSearchList] = React.useState(false)
    
    React.useEffect(() => {
        setnewSearchList(conversations.filter((n)=>  n.title===searchConversation ))
        if (searchConversation.length > 0) {
            setsearchList(true)
        }
        else {
            setsearchList(false)
        }
    }, [searchConversation])
    
    const joinRoom = (conversationId) => {
        socket.emit("joinRoom", { username: process.env.REACT_APP_EMAIL, roomname: conversationId })
    }
    const disconnect = (conversationId) => {
        socket.emit("disconect");
    }

    const SendLiveMessage = (message) => {
           socket.emit("chat1", message);
    }
    
    let conversationContent = (
        <>
            <NoConversations></NoConversations>
        </>
    );

    if (selectedConversation) {
        conversationContent = (
            <>
                <MessageList conversationId={selectedConversation.id} selectedConversation={selectedConversation}/>
            </>
        );
    }

    return (
        <div id="chat-container">
            <ConversationSearch
                searchConversation={searchConversation}
                setsearchConversation={setsearchConversation}
                conversations={conversations}
            />
            {searchList && <ConversationList
                onConversationItemSelected={conversationChanged}
                joinRoom={joinRoom}
                disconnect={disconnect}
                conversations={newsearchList}
                selectedConversation={selectedConversation}
                conversationRender={conversationRender}
                setconversationRender={setconversationRender} />}

            {!searchList && <ConversationList
                onConversationItemSelected={conversationChanged}
                joinRoom={joinRoom}
                disconnect={disconnect}
                conversations={conversations}
                selectedConversation={selectedConversation}
                conversationRender={conversationRender}
                setconversationRender={setconversationRender} />}

            
            
            <NewConversation />
            <ChatTitle 
                selectedConversation={selectedConversation}
                onDeleteConversation={onDeleteConversation}
                socket={socket}
            />
            {conversationContent}
            <ChatForm 
                selectedConversation={selectedConversation}
                onMessageSubmitted={onMessageSubmitted}
                onMessageUpdate={onMessageUpdate}
                messageDetails={messageDetails}
                sendMessage={sendMessage}
                SendLiveMessage={SendLiveMessage}
                updateConversationDateMessage={updateConversationDateMessage}
            />
        </div>
    );
}

const mapStateToProps = state => {
    return {
        conversations: state.conversationState.conversations,
        selectedConversation: state.conversationState.selectedConversation,
        messageDetails: state.messagesState.messageDetails
    };
}; 
  
const mapDispatchToProps = dispatch => ({
    conversationChanged: conversationId => dispatch(conversationChanged(conversationId)),
    onMessageSubmitted: (messageText, date , time) => { dispatch(newMessageAdded(messageText, date , time)); },
    onMessageUpdate: (conversationId, messages, hasMoreMessages, lastMessageId, isMyMessage, date,time) => { dispatch(updateMessagesDetails(conversationId, messages, hasMoreMessages, lastMessageId, isMyMessage, date,time)); },
    sendMessage: (conversationId, messages, email) => { dispatch(sendMessage(conversationId, messages, email)); },
    updateConversation: (conversationId, email) => { dispatch(updateConversation(conversationId, email)) },
    deletedAddedConversation: (conversationId) => { dispatch(deletedAddedConversation(conversationId)) },
    onDeleteConversation: () => { dispatch(conversationDeleted()); },
    loadConversations: () => { dispatch(conversationsRequested())},
    updateConversationDateMessage: (conversationId, messages, date , time) => { dispatch(updateConversationDateMessage(conversationId, messages, date , time)) },
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChatShell);