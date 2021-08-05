import { createSlice } from '@reduxjs/toolkit';

const initialMsgState = { count: 0,room_id:0,upcomingconversations:[],upcomingmessages:[],upcomingconversationlist:[]};
const msgSlice= createSlice({
    name: 'message',
    initialState:initialMsgState,
    reducers: {
        increment(state) {state.count = state.count + 1;console.log(`--------------------------increment->${state.count}`)},
        setCount(state, action) { state.count = action.payload.c; },
        setRoom(state, action) { state.room_id = action.payload.room_id; },
        setconversation(state, action) { state.upcomingconversations= [...state.upcomingconversations,...action.payload.msg]},
        setconversationlist(state, action) { state.upcomingconversationlist= [...action.payload.list]},
        setmessage(state, action) { state.upcomingmessages= [...state.upcomingmessages,...action.payload.newmsg]},
        setmessagenull(state, action) { state.upcomingmessages= []},
        
    }
});


export const messageAction = msgSlice.actions;
export default msgSlice.reducer;





