import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App'
import ChatBox from './component/ChatBox';
import io from "socket.io-client";
// const socket = io.connect('http://localhost:4000/');
// const socket = io.connect('/');
const socket = io(process.env.REACT_APP_NODE_API);
// import { BrowserRouter as  Router,Route, Switch } from "react-router-dom";

// var socket = io({transports: ['websocket'], upgrade: false}).connect('/');
ReactDOM.render(
  //    <Router>
  //       <Switch>
  //             <Route path="/:id" component={ChatBox} />
  //   </Switch>
  // </Router>,


 <ChatBox  _id={localStorage.getItem("tenant_id")} socket={socket} />, 

  document.getElementById('root')
);
