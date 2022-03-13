import React from 'react';
import classNames from 'classnames';

import './ConversationItem.scss';

const ConversationItemArchive = ({ conversation, isActive,  onConversationItemSelected }) =>{
    const className = classNames('conversation', {
        'active': isActive
    });
    const style = {
        height: "10px !important",
         width: "10px  !important"
    }
    return (
        <div className={className} onClick={() => { onConversationItemSelected(conversation.id);} }>
            <img src={conversation.imageUrl} alt={conversation.imageAlt} />
         {conversation.isactive &&   <img style={{  height: "10px", width: "10px",position: "fixed" }}  src={'/images/green_dot.png'} />}
               
            <div className="title-text">{conversation.title}</div>
            <div className="created-date">{conversation.createdAt}</div>
            <div className="conversation-message">
                {conversation.latestMessageText}
            </div>
        </div>

    );
}

export default ConversationItemArchive;