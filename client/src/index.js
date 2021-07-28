import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/styles/tailwind.css";
import "assets/styles/style.css";
import 'react-chat-widget/lib/styles.css';
// layouts
import Admin from "layouts/Admin.js";
import User from "layouts/UserDashboard.js";



import App from './components/App';
import Auth from "layouts/Auth.js";
// views without layouts
import Landing from "views/Landing.js";
import Profile from "views/Profile.js";
import Index from "views/Index.js";
import { Widget, addResponseMessage } from 'react-chat-widget';
import * as serviceWorker from './serviceWorker';
import PrivateRoute from 'hooks/privateRouter'
import {Provider} from 'react-redux'
import  store  from './Reducer/store/index';
import { persistor}  from './Reducer/store/index';

import { PersistGate } from 'redux-persist/integration/react'

const handleNewUserMessage = (newMessage) => {
  console.log(`New message incomig! ${newMessage}`);
} 
  // Now
// persistStore(store, {}, () => {
  ReactDOM.render(
    <Provider store={store}>

      <BrowserRouter>
      <PersistGate loading={null} persistor={persistor}>
        <Switch>
          {/* add routes with layouts */}
          <PrivateRoute path="/user" component={User} />
          <PrivateRoute path="/admin" component={Admin} />
          <Route path="/auth" component={Auth} />
          {/* add routes without layouts */}
          <Route path="/landing" exact component={() => <Landing Widget={Widget} />} />
          <Route path="/profile" exact component={Profile} />
          <PrivateRoute path="/chat" component={App} />
          <Route path="/" exact component={() => <Index Widget={Widget} />} />
          {/* add redirect for first page */}
        </Switch>
        <Widget
          handleNewUserMessage={handleNewUserMessage}
          title="My new awesome title"
          subtitle="And my cool subtitle"
          />
          </PersistGate>
      </BrowserRouter>
     
    </Provider>,
    document.getElementById("root")
  );

  serviceWorker.register();
// })