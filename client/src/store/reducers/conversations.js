const initialState = {
    conversations: [],
    selectedConversation: {}
};

// initialState.selectedConversation = initialState.conversations[1];

const conversationsReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'CONVERSATIONS_LOADED': {
           
            const newState = {
                conversations: [],
                selectedConversation: {}
            }
            newState.conversations = action.payload.conversations ? action.payload.conversations : [];
            newState.selectedConversation = action.payload.selectedConversation;

            return newState;
        }
        case 'CONVERSATIONS_RENDER': {
       
            const newState = {};
            newState.conversations = action.payload.conversations ;
            newState.selectedConversation = action.payload.selectedConversation;
            state = null;
            console.log('-------------------S S State->', state);
            state = newState;
            console.log('-------------------S S newState->', newState);
            return state;
        }
      case 'SELECTED_CONVERSATION_CHANGED': {
        const newState = { ...state };
        newState.selectedConversation = 
            newState.conversations.find(conversation => conversation.id === action.conversationId
            );

        return newState;
        }

            
        case 'UPDATE_CONVERSATION_DATE_MESSAGE': {

            const { conversationId, message, time } = action.payload;
            const newState = { ...state };

            var updatedState = newState.conversations.find(conversation => conversation.id === conversationId);
                     
       
            let selectedConversationIndex = newState.conversations.findIndex(c => c.id === conversationId);
            newState.conversations.splice(selectedConversationIndex, 1);
    
         
            newState.conversations.unshift({
                id:updatedState.id,
                imageUrl: updatedState.imageUrl,
                imageAlt: updatedState.imageAlt,
                title: updatedState.title,
                createdAt: time,
                is_active:updatedState.is_active,
                latestMessageText:message ,
                messages: updatedState.messages,
    
               } )
               
                                                                                                                                                               
            return newState;
            }                
        case 'UPDATE_CONVERSATION': {
            const existingState = { ...state };
            const newState = existingState;
            const { conversationId ,time ,email} = action.payload;
            let selectedConversationIndex = newState.conversations.findIndex(c => c.id === conversationId);
            newState.conversations.splice(selectedConversationIndex, 1);
    
                                         
          newState.conversations.unshift( {
            id: conversationId,
            imageUrl: require('../../images/profiles/daryl.png'),
            imageAlt: email,
            title: email,
            createdAt: time,
            is_active:1,
            latestMessageText: 'New Message',
            messages: []
        },)
            
          
        console.log('--------------------Updated Redux conversation',newState)
        return newState;
        }
            
        case 'DELETED_ADDED_CONVERSATION': {

            const newState = { ...state };
            const { conversationId } = action.payload;
            let selectedConversationIndex = newState.conversations.findIndex(c => c.id === conversationId);
            newState.conversations.splice(selectedConversationIndex, 1);
            console.log('--------------------del added conversation',newState)
        return newState;
      }
            
      case 'DELETE_CONVERSATION': {
        if (state.selectedConversation) {
            const newState = { ...state };

            let selectedConversationIndex = 
            newState.conversations.findIndex(c => c.id === newState.selectedConversation.id);
            newState.conversations.splice(selectedConversationIndex, 1);

            if (newState.conversations.length > 0) {
                if (selectedConversationIndex > 0) {
                    --selectedConversationIndex;
                }
        
                newState.selectedConversation = newState.conversations[selectedConversationIndex];
            } else {
                newState.selectedConversation = null;
            }

            return newState;
        }
        
        return state;
      }
      case 'NEW_MESSAGE_ADDED': {
          if (state.selectedConversation) {
            const newState = { ...state };
            newState.selectedConversation = { ...newState.selectedConversation };
           
            newState.selectedConversation.messages.unshift(
                {
                    imageUrl: null,
                    imageAlt: null,
                    messageText: action.payload.textMessage,
                    createdAt: action.payload.date+' '+action.payload.time,
                    isMyMessage: true
                },
            )
            console.log('-----------Redux triggered',newState)
            return newState;
          }

          return state;
      }
      default:
        return state;
    }
  }
  
export default conversationsReducer;