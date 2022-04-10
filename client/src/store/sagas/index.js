import { all } from 'redux-saga/effects';

import { watchGetConversationsAsync,watchRenderConversationsAsync,DeletedConversation } from './conversations';
import { watchGetMessagesAsync,watchSendMessagesAsync, DeletedMessage } from './messages';

export default function* rootSaga() {
    yield all([watchGetConversationsAsync(),
        watchRenderConversationsAsync(),
        DeletedConversation(),
        DeletedMessage(),
        watchGetMessagesAsync(),
        watchSendMessagesAsync()]);
}