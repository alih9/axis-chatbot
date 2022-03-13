import React from 'react';

import ConversationItemArchive from '../conversation-item/ConversationItemArchive';
import './ConversationList.scss';

const ConversationListArchive = ({ conversations, selectedConversation, onConversationItemSelected,conversationRender,setconversationRender }) =>{

    React.useEffect(() => {
        console.log('---------------conversation Changed', conversations)
        if (conversationRender) {
            conversations = conversations;
            setconversationRender(false)
        }
    }, [conversationRender]);

    const conversationItems = conversations.map((conversation)=>{
        const conversationIsActive = selectedConversation && conversation.id === selectedConversation;

        return <ConversationItemArchive  
            key={ conversation.id }
            onConversationItemSelected={onConversationItemSelected}
            isActive={ conversationIsActive }
            conversation={ conversation } />;
    });

    return (
        <div id="conversation-list">
            {conversationItems}
        </div>
    );
}  

export default ConversationListArchive;