const initialState = {
    messageDetails: {}
} 

const messagesReducer = (state = initialState, action) => {
    switch(action.type) { 
        case 'MESSAGES_LOADED': {
            console.log("MESSAGES LOADED");
            const { conversationId, messages, hasMoreMessages, lastMessageId } = action.payload;
            const currentConversationMapEntry = state.messageDetails[conversationId];
            const newConversationMapEntry = { hasMoreMessages, lastMessageId, messages: [] };

            if (currentConversationMapEntry) {
                newConversationMapEntry.messages = [...currentConversationMapEntry.messages];
            }

            newConversationMapEntry.messages = [...newConversationMapEntry.messages, ...messages];

            const newMessageDetails = { ...state.messageDetails };
            newMessageDetails[conversationId] = newConversationMapEntry;

            return { messageDetails: newMessageDetails };
        }
        case 'UPDATED_MESSAGE_DETAIL': {
            console.log(action.payload);
            const { conversationId, messages, hasMoreMessages, lastMessageId, isMyMessage, date, time, msg_id, parent_id} = action.payload;
            const currentConversationMapEntry = state.messageDetails[conversationId];
            const newConversationMapEntry = { hasMoreMessages, lastMessageId, messages: [] };

            if (currentConversationMapEntry) {
                newConversationMapEntry.messages = [...currentConversationMapEntry.messages];
            }
            
           
            newConversationMapEntry.messages.unshift(
                  {
                      id: parent_id,
                      msg_id: msg_id,
                      room_id: conversationId,
                      imageUrl: require('../../images/profiles/user.png'),
                      imageAlt: null,
                      messageText: messages,
                      createdAt: date+' '+time,
                      isMyMessage: isMyMessage
                  },
              )

          
              const newMessageDetails = { ...state.messageDetails };
              newMessageDetails[conversationId] = newConversationMapEntry;
  
              return { messageDetails: newMessageDetails };
        }
        case 'MESSAGE_DELETE': {
            console.log(action.payload);
            const {msg_id, room_id} = action.payload;
            const newState = {...state};

            const selectedMessageIndex = newState.messageDetails[room_id].messages.findIndex((msg)=> msg.msg_id == msg_id);
            newState.messageDetails[room_id].messages.splice(selectedMessageIndex,1);

            return newState;
        }

        case 'MESSAGE_DELETE_DETAIL': {
            console.log(action.payload);
            const {room_id} = action.payload;
            const newState = {...state};
            delete newState.messageDetails[room_id]
            return newState;
        }

        default: 
            return state;
    }
}



export default messagesReducer;