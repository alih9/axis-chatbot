import React from 'react';

import ConversationItem from '../conversation-item/ConversationItem';
import './ConversationList.scss';

const ConversationList = ({ conversations, selectedConversation, onConversationItemSelected,joinRoom, disconnect,conversationRender, activeUsers,setconversationRender,socket }) => {
    
    React.useEffect(() => {
        console.log('---------------conversation Changed', conversations)
        if (conversationRender) {
            conversations = conversations;
            setconversationRender(false)
        }
    }, [conversationRender]);
    

    const conversationItems = conversations.map((conversation) => {
        const conversationIsActive = selectedConversation && conversation.id === selectedConversation.id;
        var activeCustomer = false;
        if(activeUsers.indexOf(conversation.id) != -1){
            activeCustomer = true;
        }
        return <ConversationItem 
            key={ conversation.id }
            onConversationItemSelected={onConversationItemSelected}
            socket={socket}
            joinRoom={joinRoom}
            disconnect={disconnect}
            isActive={ conversationIsActive }
            activeCustomer = { activeCustomer }
            conversation={ conversation } />;
    });

    return (
        <div id="conversation-list">
            {conversationItems}
        </div>
    );
}

export default ConversationList;