const initialState = {
    messageDetails: {}
} 

const messagesReducer = (state = initialState, action) => {
    switch(action.type) { 
        case 'MESSAGES_LOADED': {
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

            const { conversationId, messages, hasMoreMessages, lastMessageId, isMyMessage, date,time} = action.payload;
            const currentConversationMapEntry = state.messageDetails[conversationId];
            const newConversationMapEntry = { hasMoreMessages, lastMessageId, messages: [] };

            if (currentConversationMapEntry) {
                newConversationMapEntry.messages = [...currentConversationMapEntry.messages];
            }
            
           
            newConversationMapEntry.messages.unshift(
                  {
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
        default: 
            return state;
    }
}



export default messagesReducer;