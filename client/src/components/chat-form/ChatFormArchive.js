import React, { useState, useEffect } from 'react';
import FormButton from '../controls/buttons/FormButton';
import AttachmentIcon from '../controls/icons/attachment-icon/AttachmentIcon';
import './ChatForm.scss';
import dates from 'date-and-time';
import  {nowdate,nowtime} from '../../utility/datetime';
const isMessageEmpty = (textMessage) =>{
    return adjustTextMessage(textMessage).length === 0;
}

const adjustTextMessage = (textMessage) => {
    return textMessage.trim();
};

const ChatFormArchive = ({ user, selectedConversation,onMessageSubmitted, onMessageUpdate, messageDetails, sendMessage, updateConversationDateMessage }) => {
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

    if(selectedConversation) {
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

        handleFormSubmit = (e) =>{
            e.preventDefault();

            if(!isMessageEmpty(textMessage)) {
                var today = new Date();
                var date=nowdate()
                var time=nowtime()
                date='';
                var currentDate = today.toGMTString();
                //No need for this method as all of the conversations are disabled
                //onMessageSubmitted(textMessage, date, time);


            }
            setTextMessage('');
        }

        //NO need for
        //SendMessage and Updateconversationandtime methods
        //As conversations are disabled


    }

    return (
        <form id="chat-form" onSubmit={handleFormSubmit}>
            {formContents}
        </form> 
    );
}

export default ChatFormArchive;
