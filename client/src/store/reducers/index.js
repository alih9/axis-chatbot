import { combineReducers } from 'redux';

import conversationState from './conversations';
import messagesState from './messages';
import usersState from './user';

export default combineReducers({
  conversationState,  messagesState, usersState
});