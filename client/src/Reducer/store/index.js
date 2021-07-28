// import { configureStore} from '@reduxjs/toolkit';
import authReducer from '../actions/auth'
import userReducer from '../actions/user'
import messageReducer from '../actions/message'
import processReducer from '../actions/process'
// import logger from 'redux-logger'
// import thunk from 'redux-thunk'
// const mid=[thunk]

// const store = configureStore({
//     reducer: {
//         auth: authReducer,
//         user: userReducer,
//         process: processReducer,
//         message:messageReducer
//     },
//     middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(mid)
// });

// export default store;



import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
const middleware = [thunk];
const userpersistConfig = {
    key: 'user',
    storage,
    whitelist:['user']
  }
const combinedReducers = combineReducers({
    auth: authReducer,
    user: userReducer,
    process: processReducer,
    message:messageReducer
});


const combinedReducer=persistReducer(userpersistConfig,combinedReducers)

const store = createStore(
  combinedReducer   ,
  compose(applyMiddleware(...middleware))
);

export let persistor = persistStore(store)
export default store;




// import { createStore } from 'redux'
// import { persistStore, persistReducer } from 'redux-persist'
// import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
 
// import messageReducer from '../actions/message'
// const persistConfig = {
//   key: 'root',
//   storage,
// }
 
// const persistedReducer = persistReducer(persistConfig, messageReducer)
// let store = createStore(persistedReducer)
// export let persistor = persistStore(store)

// export default store;
