import { put, takeEvery ,takeLatest} from 'redux-saga/effects';
import dates from 'date-and-time';
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

const getactiveroom = async (chatRoom_id) => {

    for (var i = 0; i < conversations.length; i++) {
    //    alert(JSON.stringify(conversations[i]))
        const NODE_API=process.env.REACT_APP_NODE_API
        const URL=`${NODE_API}/api/checkuseractivation`
       const a=await fetch(URL, {
            method: 'POST',
            headers: {
                    'Content-Type': 'application/json',
                    // 'authorization': AuthStr 
                  },
          body:JSON.stringify({'chat_room_id':conversations.id})
        }).then(response => response.json())
           .then(data => {

               conversations[i].isactive = data.is_active;
        //    alert(JSON.stringify(data))
            }).catch((error) => {
                console.error('Error:', error);
            });
    } 
    

}


const getConversations = async () => {
    const NODE_API=process.env.REACT_APP_NODE_API
    const URL=`${NODE_API}/api/show_all_user_chat`
    await fetch(URL, { 
        method: 'GET',
    })
    .then(response => response.json())
        .then(async(data) => {
            let newConversations = data.chat.map((result) => {
                //   const user = result.user;
                const now = new Date(result.chatRoom.last_message_update_at)
                // var currentDate = date.format(now, 'YYYY-MM-DD hh:mm:ss');
                // alert(myDate.toLocaleString());
            
               const currentDate = now.toLocaleString();
                return {
                    id: result.chatRoom.id,
                    imageUrl: require('../../images/profiles/user.png'),
                    imageAlt: `${result.chatRoom.room_name}`,
                    title: `${result.chatRoom.room_name}`,
                    createdAt: `${currentDate}`,
                    latestMessageText: `${result.chatRoom.last_message}`,
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
    yield (getactiveroom())
    yield delay(1000);
    // yield put(messagesLoaded(conversations[0].id, conversations[0].messages, false, null));
    yield put({
        type: 'CONVERSATIONS_LOADED',
        payload: {
            conversations,
            selectedConversation: ""
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
