import React from 'react';
import './Compose.css';

export default function Compose(props) {
  const [msg, setmsg] = React.useState('')
  
  
  const handleKeypress = e => {
    //it triggers by pressing the enter key
    // alert(JSON.stringify(e.keyCode));
    if (e.keyCode === 13) {
      if (msg) {
        setmsg('')
        props.sendMessage(msg);
        
      }
    } 
  }
    return (
      <div className="compose" style={{ position: "sticky"  } }>
       
       
        <input
        type="text"
        className=" border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
        placeholder="Type a message, @name" value={msg}  onKeyDown={handleKeypress} onChange={(e) => setmsg(e.target.value)}
       />
      
       
        {
          props.rightItems
        }
      </div>
    );
}