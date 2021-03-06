import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./index.scss";
import rootSaga from "./store/sagas";
import rootReducer from "./store/reducers";
import App from "./App";

import ChatShellArchive from "./containers/shell/ChatShellArchive";
import Auth0Provider from "./auth0-provide";
const sagaMiddleware = createSagaMiddleware();
const composeEnhancers =
  typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose;
const enhancer = composeEnhancers(applyMiddleware(sagaMiddleware));
const store = createStore(rootReducer, enhancer);
sagaMiddleware.run(rootSaga);

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Switch>
        <Auth0Provider>
          <Route
            exact
            path={`${process.env.REACT_APP_BASE_PATH}/inbox`}
            component={App}
          />
          <Route
            exact
            path={`${process.env.REACT_APP_BASE_PATH}/archive`}
            component={() => <ChatShellArchive type={"archive"} />}
          />
        </Auth0Provider>
      </Switch>
      <ToastContainer autoClose={2000} />
    </Router>
  </Provider>,
  document.getElementById("root")
);
