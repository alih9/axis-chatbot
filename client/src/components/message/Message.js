import React from 'react';
import classNames from 'classnames';
import axios from 'axios';
import './Message.scss';

const Message = ({ isMyMessage, message, OnDeleteMessage }) => {
    const messageClass = classNames('message-row', {
        'you-message': isMyMessage,
        'other-message': !isMyMessage
    });
    console.log(OnDeleteMessage);
    const imageThumbnail = isMyMessage ? null : <img src={message.imageUrl} alt={message.imageAlt} />;
    const deleteMessage =async(m)=>{
        console.log(m);
        console.log(m.id,m.email);
        const NODE_API = process.env.REACT_APP_NODE_API
        const URL = `${NODE_API}/api/deletemessage`
        const AuthStr='Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYyNTk5MTMwNywiZXhwIjoxNjI2MDc3NzA3fQ.rtQZNlGvIxkdFvlXJjU-ddIhBjXkpAEz7_x2O9bcLcE';

        await axios({
            method: 'post',
            url: URL,
            headers: {
                'Content-type': 'application/json',
                'authorization': AuthStr
            },
            data: {
                parent_id: m.id,
                email : m.email,
                created_at: m.createdAt
            }
        })
    }       
    return (
        <div className={messageClass}>
            <div className="message-content">
                {imageThumbnail}
                <div className="message-text">
                    {message.messageText}
                </div>
                <div className="message-dropdown">
                    <button onClick={()=>{OnDeleteMessage(message);}}>Delete Message</button>
                </div>
                {/* <div className="message-dropdown-content">
                    <p>Hello World!</p>
                </div> */}
                <div className="message-time">{message.createdAt}</div>
            </div>
        </div>
    );
}

export default Message;