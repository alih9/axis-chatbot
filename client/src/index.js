import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { BrowserRouter as  Router,Route, Switch } from "react-router-dom";

import './index.scss';
import rootSaga from './store/sagas';
import rootReducer from './store/reducers';
import App from './App';
import Auth0Provider from "./auth0-provide";
const sagaMiddleware = createSagaMiddleware();
const composeEnhancers =  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?   
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    }) : compose;
const enhancer = composeEnhancers(applyMiddleware(sagaMiddleware));
const store = createStore(rootReducer, enhancer);
sagaMiddleware.run(rootSaga);

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <Auth0Provider>
                <Switch>
                    <Route path="/" component={App} />
                </Switch>
            </Auth0Provider>
        </Router>
    </Provider>,
    document.getElementById('root')
);
