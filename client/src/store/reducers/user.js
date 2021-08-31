const initialState = {
    userDetails: {}
} 

const usersReducer = (state = initialState, action) => {
    switch(action.type) { 
        case 'UPDATED_USER_CREDENTIAL': {
            const { user } = action.payload;
            return { userDetails: user };
        }
        default: 
            return state;
    }
}



export default usersReducer;