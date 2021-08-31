import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ChatBox from './component/ChatBox';

import { BrowserRouter as  Router,Route, Switch } from "react-router-dom";

// var socket = io({transports: ['websocket'], upgrade: false}).connect('/');
ReactDOM.render(
     <Router>
        <Switch>
              <Route path="/:id" component={ChatBox} />
    </Switch>
  </Router>,
  document.getElementById('root')
);
