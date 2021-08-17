import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { messagesRequested } from '../../store/actions';
import Message from '../../components/message/Message';
import './MessageList.scss';

const MessageList = ({ selectedConversation,conversationId, getMessagesForConversation, loadMessages }) => {
    const messageDetails = getMessagesForConversation(conversationId);
    let messages = messageDetails ? messageDetails.messages: null;
    let messageItems = null;

    
    useEffect(() => {
        if (!messageDetails) {
            loadMessages(conversationId, null);
        }
    }, [messageDetails, loadMessages, conversationId])

    if (messages && messages.length > 0) {
        messageItems = messages.map((message, index) => {
            return <Message key={index} isMyMessage={message.isMyMessage} message={message} />;
        });
    }

    return (
        <div id="chat-message-list">
            {messageItems}
        </div>
    );
}

const mapStateToProps = state => {
    const getMessagesForConversation = conversationId => {
        return state.messagesState.messageDetails[conversationId];
      
    }

    return {
        getMessagesForConversation:getMessagesForConversation,
        // selectedConversation: state.conversationState.selectedConversation
    }
}

const mapDispatchToProps = dispatch => {
    const loadMessages = (conversationId, lastMessageId) => {
        dispatch(messagesRequested(conversationId, 10, lastMessageId));
    }

    return { loadMessages };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MessageList);