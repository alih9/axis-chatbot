import React, {useEffect} from 'react';
import shave from 'shave';

import { useSelector } from 'react-redux';
import './ConversationListItem.css';

export default function ConversationListItem(props) {
  useEffect(() => {
    shave('.conversation-snippet', 20);
  })

  const useremail = useSelector(state => state.user.email)
    const { photo, name, text ,chat_room_id} = props.data;

    return (
      <div className="conversation-list-item" onClick={()=>props.openUserConversation(chat_room_id)}>
        <img className="conversation-photo" src={photo} alt="conversation" />
        <div className="conversation-info">
          <h1 className="conversation-title">{ name }</h1>
          <p className="conversation-snippet">{ text }</p>
        </div>
      </div>
    );
}