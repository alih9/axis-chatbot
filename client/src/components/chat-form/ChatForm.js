import React, { useState, useEffect } from 'react';
import FormButton from '../controls/buttons/FormButton';
import AttachmentIcon from '../controls/icons/attachment-icon/AttachmentIcon';
import './ChatForm.scss';
import dates from 'date-and-time';
import  {nowdate,nowtime} from '../../utility/datetime'
const isMessageEmpty = (textMessage) => {
    return adjustTextMessage(textMessage).length === 0;
}

const adjustTextMessage = (textMessage) => {
    return textMessage.trim();
};

const ChatForm = ({ user, selectedConversation, onMessageSubmitted, onMessageUpdate, messageDetails, sendMessage,SendLiveMessage,updateConversationDateMessage }) => {
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
                var date=nowdate()
                var time=nowtime()
                date='';
                var currentDate = today.toGMTString();
                
                onMessageSubmitted(textMessage, date , time);
                if (selectedConversation !== undefined) {
                    const conversationId = selectedConversation.id;
                    //messageDetails is message state
                    //onMessageUpdate(conversationId, textMessage, messageDetails[conversationId].hasMoreMessages, messageDetails[conversationId].lastMessageId, true, date , time)
                    //SendLiveMessage(textMessage,conversationId);
                    const email = user.email;
                    sendmsg(conversationId, textMessage, email, currentDate ,date, time);
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




    const sendmsg = async(conversationId, messages, email, GMTdate , date, time) => {
        // alert(date)
        const NODE_API = process.env.REACT_APP_NODE_API
        const URL=`${NODE_API}/api/tenantchatting`
        // const token = Cookies.get('token');
        // const AuthStr='Bearer '+token;
       await fetch(URL, { 
            method: 'POST',
            headers: {
                    'Content-Type': 'application/json',
                    // 'authorization': AuthStr 
                  },
          body:JSON.stringify({'room_id':conversationId,'email':email,'message':messages,'date':GMTdate ,'time': time})
        })
        .then(response => response.json())
            .then(async (data) => {
                // data.msg
                console.log(data.message.parent_message_id);
                console.log('Sucessfully Saved');
                onMessageUpdate(conversationId, textMessage, messageDetails[conversationId].hasMoreMessages, messageDetails[conversationId].lastMessageId, true, date , time, data.message.id, data.message.parent_message_id );
                SendLiveMessage(textMessage,conversationId,data.message.parent_message_id);
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