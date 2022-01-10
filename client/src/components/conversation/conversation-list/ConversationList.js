import React from 'react';

import ConversationItem from '../conversation-item/ConversationItem';
import './ConversationList.scss';

const ConversationList = ({ conversations, selectedConversation, onConversationItemSelected,joinRoom, disconnect,conversationRender,setconversationRender,socket }) => {
    
    React.useEffect(() => {
        console.log('---------------conversation Changed', conversations)
        if (conversationRender) {
            conversations = conversations;
            setconversationRender(false)
        }
    }, [conversationRender]);

    

    const conversationItems = conversations.map((conversation) => {
        const conversationIsActive = selectedConversation && conversation.id === selectedConversation.id;

        return <ConversationItem 
            key={ conversation.id }
            onConversationItemSelected={onConversationItemSelected}
            socket={socket}
            joinRoom={joinRoom}
            disconnect={disconnect}
            isActive={ conversationIsActive }
            conversation={ conversation } />;
    });

    return (
        <div id="conversation-list">
            {conversationItems}
        </div>
    );
}

export default ConversationList;