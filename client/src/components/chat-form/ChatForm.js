import React, { useState, useEffect } from 'react';

import FormButton from '../controls/buttons/FormButton';
import AttachmentIcon from '../controls/icons/attachment-icon/AttachmentIcon';

import './ChatForm.scss';

const isMessageEmpty = (textMessage) => {
    return adjustTextMessage(textMessage).length === 0;
}

const adjustTextMessage = (textMessage) => {
    return textMessage.trim();
};

const ChatForm = ({ selectedConversation, onMessageSubmitted, onMessageUpdate, messageDetails, sendMessage,SendLiveMessage,updateConversationDateMessage }) => {
    const [textMessage, setTextMessage] = useState('');
    const [disableButton, setdisableButton] = useState(false);
    const [senddisableButton, setsenddisableButton] = useState(true);
    let formContents = null;
    let handleFormSubmit = null;
    
    useEffect(() =>
    {
        if (senddisableButton)
            setdisableButton(isMessageEmpty(textMessage))
    },[textMessage, senddisableButton])
    
    if (selectedConversation) {
        formContents = (
            <>
                <div title="Add Attachment">
                    <AttachmentIcon />
                </div>
                <input 
                    type="text" 
                    placeholder="type a message" 
                    value={textMessage}
                    onChange={ (e) => { setTextMessage(e.target.value); } } />
                <FormButton disabled={ disableButton }>Send</FormButton>
            </>
        );
    
        handleFormSubmit = (e) => {
            e.preventDefault();
            
            if (!isMessageEmpty(textMessage)) {
                var today = new Date();
                var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
                var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                // var dateTime = date+' '+time;
                onMessageSubmitted(textMessage, date , time);
                if (selectedConversation !== undefined) {
                    const conversationId = selectedConversation.id;
                   
                    onMessageUpdate(conversationId, textMessage, messageDetails[conversationId].hasMoreMessages, messageDetails[conversationId].lastMessageId, true, date , time)
                    SendLiveMessage(textMessage);
                    const email = process.env.REACT_APP_EMAIL;
                    sendmsg(conversationId, textMessage, email);
                    setdisableButton(true);
                    setsenddisableButton(false)
                    updateConversationDateMessage(conversationId, textMessage, date , time)
                }
                setTextMessage('');
            }
        };
    }



    const sendmsg = async(conversationId, messages, email) => {
    
        const NODE_API = process.env.REACT_APP_NODE_API
        const URL=`${NODE_API}/api/tenantchatting`
        // const token = Cookies.get('token');
        // const AuthStr='Bearer '+token;
        // alert(process.env.REACT_APP_EMAIL)
       await fetch(URL, { 
            method: 'POST',
            headers: {
                    'Content-Type': 'application/json',
                    // 'authorization': AuthStr 
                  },
          body:JSON.stringify({'room_id':conversationId,'email':email,'message':messages})
        })
        .then(response => response.json())
            .then(async (data) => {
                // data.msg
                console.log('Sucessfully Saved');
                setTimeout(() => {
                    setdisableButton(false);
                    setsenddisableButton(true)
                },1000)
            })
            .catch((error) => { console.error('Error:', error);
            });
    }


    return (
        <form id="chat-form" onSubmit={handleFormSubmit}>
            {formContents}
        </form> 
    );
}

export default ChatForm;