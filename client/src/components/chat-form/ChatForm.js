import React, { useState, useEffect } from 'react';
import FormButton from '../controls/buttons/FormButton';
import AttachmentIcon from '../controls/icons/attachment-icon/AttachmentIcon';
import './ChatForm.scss';
import dates from 'date-and-time';
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
                var date = dates.format(today, 'DD/MM/YYYY');
                var time=dates.format(today, 'hh:mm:ss');

                var currentDate = today.toGMTString();
            
                //  date = today.toLocaleString();
                // var date = today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
                // var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                // var dateTime = date+' '+time;
                onMessageSubmitted(textMessage, date , time);
                if (selectedConversation !== undefined) {
                    const conversationId = selectedConversation.id;
                   
                    onMessageUpdate(conversationId, textMessage, messageDetails[conversationId].hasMoreMessages, messageDetails[conversationId].lastMessageId, true, date , time)
                    SendLiveMessage(textMessage);
                    const email = process.env.REACT_APP_EMAIL;
                    sendmsg(conversationId, textMessage, email, currentDate , time);
                    setdisableButton(true);
                    setsenddisableButton(false)
                    updateConversationDateMessage(conversationId, textMessage, date , time)
                }
                setTextMessage('');
            }
        };
    }

    const updateconversationdatetime = async (conversationId, textMessage, date, time) => {
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
          body:JSON.stringify({'room_id':conversationId,'message':textMessage,'date':date,'time':time})
        })
        .then(response => response.json())
            .then(async (data) => {
                // data.msg
                console.log('Conversation date time successfully saved');
              
            })
            .catch((error) => { console.error('Error:', error);
            });
 
    }




    const sendmsg = async(conversationId, messages, email, date , time) => {
        alert(date)
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
          body:JSON.stringify({'room_id':conversationId,'email':email,'message':messages,'date':date ,'time': time})
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