import { createSlice ,configureStore} from '@reduxjs/toolkit';

const initialUserState = { email: 'a'};
const userSlice= createSlice({
    name: 'user',
    initialState:initialUserState,
    reducers: {
        setemail(state,action) { state.email=action.payload.email;},
    
    }
});


export const userAction = userSlice.actions;
export default userSlice.reducer;