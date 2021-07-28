import { createSlice ,configureStore} from '@reduxjs/toolkit';

const initialProcessState = { encrypt: false, text: {}, cypher: {}};
const processSlice= createSlice({
    name: 'process',
    initialState:initialProcessState,
    reducers: {
        msg(state, actions) {
            state.encrypt = actions.encrypt;
            state.text = actions.text;
            state.cypher=actions.cypher;
        
        },
        
    }
});


export const processAction = processSlice.actions;
export default processSlice.reducer;