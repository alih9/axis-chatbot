import React from 'react';
import classNames from 'classnames';

import './ConversationItem.scss';

const ConversationItem = ({ conversation, isActive, onConversationItemSelected,joinRoom, disconnect }) => {
    const className = classNames('conversation', {
        'active': isActive
    });

    return (
        <div className={className} onClick={() => { onConversationItemSelected(conversation.id); disconnect(conversation.id); joinRoom(conversation.id) } }>
            <img src={conversation.imageUrl} alt={conversation.imageAlt} />
            <div className="title-text">{conversation.title}</div>
            <div className="created-date">{conversation.createdAt}</div>
            <div className="conversation-message">
                {conversation.latestMessageText}
            </div>
        </div>
    );
}

export default ConversationItem;