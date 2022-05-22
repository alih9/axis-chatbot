import React from 'react';
import classNames from 'classnames';

import './ConversationItem.scss';

const ConversationItem = ({ conversation, isActive, activeCustomer, onConversationItemSelected,joinRoom, disconnect ,socket}) => {
    const className = classNames('conversation', {
        'active': isActive
    });
    const style = {
        height: "10px !important",
         width: "10px  !important"
    }
    return (
        <div className={className} onClick={() => { onConversationItemSelected(conversation.id); disconnect(conversation.id); joinRoom(conversation.id); socket.emit('')  } }>
            <div className='customer-img' > 
                {/* {activeCustomer  && <img style={{  height: "10px", width: "10px",position: "relative" }}  src={'/images/green_dot.png'} />} */}
                {/* <div className='customer-img'> */}
                <div style={{position: "relative"}}>
                <img src={conversation.imageUrl} alt={conversation.imageAlt}/>
                {activeCustomer  && <img style={{  height: "12px", width: "12px",position: "absolute", top:"30px", left:"27px"  }}  src={'/images/green_dot.png'} />}
                </div>
                {/* </div> */}
            </div>
            <div className="title-text">{conversation.title}</div>
            <div className="created-date">{conversation.createdAt}</div>
            <div className="conversation-message">
                {conversation.latestMessageText}
            </div>
        </div>
    );
}

export default ConversationItem;