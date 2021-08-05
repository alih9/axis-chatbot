export const conversationChanged = conversationId => ({
    type: 'SELECTED_CONVERSATION_CHANGED',
    conversationId
});

export const conversationsRequested = () => ({
    type: 'CONVERSATIONS_REQUESTED'
});

export const conversationsRenderRequested = (conversations,selectedConversation) => ({
    type: 'CONVERSATIONS_RENDER_REQUESTED',
    payload: {  selectedConversation }
});



export const conversationDeleted = () => ({
    type: 'DELETE_CONVERSATION'
});

export const newMessageAdded = (textMessage, date, time) => ({
    type: 'NEW_MESSAGE_ADDED',
   payload:{ textMessage, date, time
}
});

export const messagesRequested = (conversationId, numberOfMessages, lastMessageId) => ({
    type: 'MESSAGES_REQUESTED',
    payload: { conversationId, numberOfMessages, lastMessageId}
});

export const messagesLoaded = (conversationId, messages, hasMoreMessages, lastMessageId) => ({
    type: 'MESSAGES_LOADED',
    payload: { conversationId, messages, hasMoreMessages, lastMessageId }
});


export const updateMessagesDetails = (conversationId, messages, hasMoreMessages, lastMessageId, isMyMessage, date,time) => ({
    type: 'UPDATED_MESSAGE_DETAIL',
    payload: { conversationId, messages, hasMoreMessages, lastMessageId, isMyMessage , date,time}
});

export const sendMessage = (conversationId, messages, email) => ({
    type: 'SEND_MESSAGE',
    payload: { conversationId, messages, email }
});

export const updateConversation = (conversationId, email) => ({
    type: 'UPDATE_CONVERSATION',
    payload: { conversationId, email }
});
export const updateConversationDateMessage = (conversationId, message, date, time) => ({
    type: 'UPDATE_CONVERSATION_DATE_MESSAGE',
    payload: { conversationId, message, date ,time }
});

export const deletedAddedConversation = (conversationId) => ({
    type: 'DELETED_ADDED_CONVERSATION',
    payload: { conversationId }
});

