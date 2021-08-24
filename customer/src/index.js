import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ChatBox from './component/ChatBox';

import io from "socket.io-client";
// const socket = io.connect('/');
const socket = io(process.env.REACT_APP_NODE_API);
// var socket = io({transports: ['websocket'], upgrade: false}).connect('/');
ReactDOM.render(
  <React.StrictMode>
     <ChatBox socket={socket}/>
   </React.StrictMode>,
  document.getElementById('root')
);
