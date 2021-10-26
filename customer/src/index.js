import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App'
import ChatBox from './component/ChatBox';
import io from "socket.io-client";
const socket = io.connect('http://localhost:4000/customertest');
// import { BrowserRouter as  Router,Route, Switch } from "react-router-dom";

// var socket = io({transports: ['websocket'], upgrade: false}).connect('/');
ReactDOM.render(
  //    <Router>
  //       <Switch>
  //             <Route path="/:id" component={ChatBox} />
  //   </Switch>
  // </Router>,

 //<App/>, 

 <ChatBox  _id={3} socket={socket} />, 


  document.getElementById('root')
);
