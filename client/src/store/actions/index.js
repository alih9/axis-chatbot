export const conversationChanged = conversationId => ({
    type: 'SELECTED_CONVERSATION_CHANGED',
    conversationId
});

export const conversationsRequested = (type) => ({
    type: 'CONVERSATIONS_REQUESTED',
    payload: {  type }
});

export const conversationsRenderRequested = (conversations,selectedConversation) => ({
    type: 'CONVERSATIONS_RENDER_REQUESTED',
    payload: {  selectedConversation }
});

export const conversationDeleted = () => ({
    type: 'DELETE_CONVERSATION_PROCEED'
});

export const messageDeleted = (message) => ({
    type: 'DELETE_MESSAGE_PROCEED',
    payload: { message }
});

export const messageDeleteDetail = (room_id) => ({
    type: 'MESSAGE_DELETE_DETAIL',
    payload: { room_id }
});

export const newMessageAdded = (textMessage, date, time) => ({
    type: 'NEW_MESSAGE_ADDED',
   payload:{ textMessage, date, time}
});

export const messagesRequested = (conversationId, numberOfMessages, lastMessageId) => ({
    type: 'MESSAGES_REQUESTED',
    payload: { conversationId, numberOfMessages, lastMessageId}
});

export const messagesLoaded = (conversationId, messages, hasMoreMessages, lastMessageId) => ({
    type: 'MESSAGES_LOADED',
    payload: { conversationId, messages, hasMoreMessages, lastMessageId }
});

export const updateMessagesDetails = (conversationId, messages, hasMoreMessages, lastMessageId, isMyMessage, date, time, msg_id, parent_id) => ({
    type: 'UPDATED_MESSAGE_DETAIL',
    payload: { conversationId, messages, hasMoreMessages, lastMessageId, isMyMessage , date, time, msg_id, parent_id}
});

export const sendMessage = (conversationId, messages, email) => ({
    type: 'SEND_MESSAGE',
    payload: { conversationId, messages, email }
});

export const updateConversation = (conversationId,username, email,time='',last_message='') => ({
    type: 'UPDATE_CONVERSATION',
    payload: { conversationId,username, email,time,last_message }
});
export const updateConversationDateMessage = (conversationId, message, date, time) => ({
    type: 'UPDATE_CONVERSATION_DATE_MESSAGE',
    payload: { conversationId, message, date ,time }
});

export const deletedAddedConversation = (conversationId) => ({
    type: 'DELETED_ADDED_CONVERSATION',
    payload: { conversationId }
});

export const updatedUserCredential = (user) => ({
    type: 'UPDATED_USER_CREDENTIAL',
    payload: { user }
}); 

export const deleteSelectedConvsersation=()=>({
    type:'SELECTED_CONVERSATION_DELETED',
})

export const conversationsLoading = (conversationsLoading) =>({
    type: 'CONVERSATIONS_LOADING',
    payload: { conversationsLoading }
});
