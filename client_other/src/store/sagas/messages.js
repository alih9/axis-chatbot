import { put, takeLatest } from 'redux-saga/effects';

import { messagesLoaded } from '../actions';

const messageDetails = {
    '2': [
        {
            id: '1',
            imageUrl: null,
            imageAlt: null,
            messageText: 'Ok fair enough. Well good talking to you.',
            createdAt: 'Oct 20',
            isMyMessage: true
        },
    ],
};



const userMessage = async (conversation_id) => {
    const NODE_API=process.env.REACT_APP_NODE_API
    const URL=`${NODE_API}/api/getmessage`
    // const token = Cookies.get('token');
    // const AuthStr='Bearer '+token;
    // alert(process.env.REACT_APP_EMAIL)
    await fetch(URL, { 
        method: 'POST',
        headers: {
                'Content-Type': 'application/json',
                // 'authorization': AuthStr 
              },
      body:JSON.stringify({'chat_room_id':conversation_id,'email':process.env.REACT_APP_EMAIL})
    })
    .then(response => response.json())
        .then(async (data) => {
            
            const msge=   await data.msg.map(result => {
                const isMyMessage = result.email === process.env.REACT_APP_EMAIL ? true : false
               return {
                    id: result.parent_message_id,
                    imageUrl: require('../../images/profiles/user.png'),
                    imageAlt: result.email,
                    email: result.email,
                    messageText: result.message,
                    createdAt: '1 week ago',
                    isMyMessage: isMyMessage
                }


                
            });
            messageDetails[conversation_id] = [...msge]
            console.log(   messageDetails );
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}


const delay = (ms) => new Promise(res => setTimeout(res, ms));

const messagesSaga = function* (action) {
    const { conversationId, numberOfMessages, lastMessageId } = action.payload;
    yield(userMessage(conversationId))
    const messages = messageDetails[conversationId];
    // const startIndex = lastMessageId ? messages.findIndex(message => message.id === lastMessageId) + 1 : 0;
    const startIndex = lastMessageId ? lastMessageId : messages.length;
    console.log('startIndex',startIndex)
    var endIndex = startIndex - numberOfMessages;
  
    if (endIndex < 0) {
        endIndex = 0;
        // It is not a number
    }
    console.log('endIndex',endIndex)
    const pageGroup = messages.slice(endIndex, startIndex);
    console.log('pageGroup',pageGroup)
    const newLastMessageId = pageGroup.length > 0 ? pageGroup[0].id : null;
    const reversepageGroup=pageGroup.reverse();
    console.log('newLastMessageId',newLastMessageId)
    // var hasMoreMessages = newLastMessageId && endIndex < (messages.length - 1);
    var hasMoreMessages = newLastMessageId && endIndex !==0;
    console.log('hasMoreMessages',hasMoreMessages)
    yield delay(500);

    yield put(messagesLoaded(conversationId,reversepageGroup,hasMoreMessages,newLastMessageId));
    if (hasMoreMessages) {
        yield delay(1000);
        yield put({
            type: 'MESSAGES_REQUESTED',
            payload: {conversationId,numberOfMessages,lastMessageId: newLastMessageId}
        })
    }
}

export const watchGetMessagesAsync = function*() {
    yield takeLatest('MESSAGES_REQUESTED', messagesSaga);
}








const sendmsg = (conversationId, messages, email) => {
    
    const NODE_API = process.env.REACT_APP_NODE_API
    const URL=`${NODE_API}/api/tenantchatting`
    // const token = Cookies.get('token');
    // const AuthStr='Bearer '+token;
    // alert(process.env.REACT_APP_EMAIL)
    fetch(URL, { 
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
        })
        .catch((error) => { console.error('Error:', error);
        });
}


const sendmessagesSaga = function* (action) {
    const { conversationId, messages, email } = action.payload;
    // alert(conversationId)
    yield delay(1000);
    yield(sendmsg(conversationId, messages, email))
    
}

export const watchSendMessagesAsync = function*() {
    yield takeLatest('SEND_MESSAGE', sendmessagesSaga);
}