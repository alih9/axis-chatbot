import React from 'react';

import './ConversationSearch.scss';

const ConversationSearch = ({ conversations }) => {
    let searchInput = null;
    const [searchConversation, setsearchConversation] = React.useState('')
    React.useEffect(() => {
       const con= conversations.filter((n)=>  n.title===searchConversation );
        console.log(con);
       
    },[searchConversation] )
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