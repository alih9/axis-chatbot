import React from 'react';

import './ConversationSearch.scss';

const ConversationSearch = ({ conversations,searchConversation,setsearchConversation }) => {
    let searchInput = null;

    
    if (conversations && conversations.length > 0) {
        searchInput = <input type="text" placeholder="Search" value={searchConversation} onChange={(e)=>setsearchConversation(e.target.value)}/>;
    }

    return (
        <div id="search-container">
            { searchInput }
        </div>
    );
}

export default ConversationSearch;