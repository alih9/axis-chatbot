import { put, takeEvery ,takeLatest} from 'redux-saga/effects';

import { messagesLoaded } from '../actions';

const delay = (ms) => new Promise(res => setTimeout(res, ms));

var conversations = [
    // { 
    //     id: '1',
    //     imageUrl: require('../../images/profiles/daryl.png'),
    //     imageAlt: 'Daryl Duckmanton',
    //     title: 'Daryl Duckmanton',
    //     createdAt: 'Apr 16',
    //     latestMessageText: 'This is a message',
    //     messages: [
    //         {
    //             imageUrl: null,
    //             imageAlt: null,
    //             messageText: 'Ok then',
    //             createdAt: 'Apr 16',
    //             isMyMessage: true
    //         },
            
    //     ]
    // },
    
];



const getConversations = async () => {
    const NODE_API=process.env.REACT_APP_NODE_API
    const URL=`${NODE_API}/api/show_all_user_chat`
    await fetch(URL, { 
        method: 'GET',
    })
    .then(response => response.json())
        .then(data => {
            let newConversations = data.chat.map(result => {
                //   const user = result.user;
                return {
                    id: result.chatRoom.id,
                    imageUrl: require('../../images/profiles/user.png'),
                    imageAlt: `${result.chatRoom.room_name}`,
                    title: `${result.chatRoom.room_name}`,
                    createdAt: '1 year ago',
                    latestMessageText: 'Thank you. I appreciate that.',
                    messages: []
                }
            });
            conversations.push(...newConversations)
            console.log(conversations)
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}


export const conversationsSaga = function* () {
    yield(getConversations())
    yield delay(1000);
    yield put(messagesLoaded(conversations[0].id, conversations[0].messages, false, null));
    yield put({
        type: 'CONVERSATIONS_LOADED',
        payload: {
            conversations,
            selectedConversation: conversations[0]
        }
    });
}

export function* watchGetConversationsAsync() {
    yield takeEvery('CONVERSATIONS_REQUESTED', conversationsSaga);
}



export const conversationsRenderSaga = function* (action) {
    console.log(action)
    conversations = action.payload.conversations;
    const sconverstion = action.payload.selectedConversation;
    
    yield delay(1000);
   yield put({
        type: 'CONVERSATIONS_RENDER',
        payload: {
            conversations:conversations,
            selectedConversation: sconverstion
        }
    });
}

export const  watchRenderConversationsAsync =function* (){
    yield takeLatest('CONVERSATIONS_RENDER_REQUESTED', conversationsRenderSaga);
}
