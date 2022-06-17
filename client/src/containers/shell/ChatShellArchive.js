import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useSelector, useDispatch } from "react-redux";
import dates from "date-and-time";
import {
  conversationChanged,
  newMessageAdded,
  conversationDeleted,
  conversationsRequested,
  updateMessagesDetails,
  sendMessage,
  updateConversation,
  deletedAddedConversation,
  updateConversationDateMessage,
} from "../../store/actions";
import ConversationSearch from "../../components/conversation/conversation-search/ConversationSearch";
import NoConversations from "../../components/conversation/no-conversations/NoConversations";
import ConversationListArchive from "../../components/conversation/conversation-list/ConversationListArchive";
import NewConversation from "../../components/conversation/new-conversation/NewConversation";
import ChatTitleArchive from "../../components/chat-title/ChatTitleArchive";
import MessageList from "../message/MessageList";
import ChatFormArchive from "../../components/chat-form/ChatFormArchive";
import LogoutButton from "../../components/util/LogoutButton";
import { toast } from "react-toastify";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { updatedUserCredential } from "../../store/actions";
import { nowtime } from "../../utility/datetime";
import Loading from "../../components/util/Loading";
import "./ChatShell.scss";

const ChatShellArchive = ({
  type,
  conversations,
  selectedConversation,
  messageDetails,
  conversationChanged,
  onMessageSubmitted,
  onMessageUpdate,
  sendMessage,
  onDeleteConversation,
  loadConversations,
  updateConversation,
  deletedAddedConversation,
  updateConversationDateMessage,
  updatedUserCredential,
  isLoading,
}) => {
  //Authentication Code
  const { user, isAuthenticated } = useAuth0();

  useEffect(() => {
    updatedUserCredential(user);
  }, []);
  const userlogin = async (user) => {
    const NODE_API = process.env.REACT_APP_NODE_API;
    const URL = `${NODE_API}/api/existuser`;
    await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'authorization': AuthStr
      },
      body: JSON.stringify({ user: user }),
    })
      .then((response) => response.json())
      .then((data) => {
        //  alert(JSON.stringify(data));
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  userlogin(user);

  const [conversationRender, setconversationRender] = useState(false);
  useEffect(() => {
    loadConversations(type);
  }, [loadConversations]);
  useEffect(() => {
    console.log("Conversations use Effect Hook invoked");
    console.log(conversations);
  }, [conversations]);
  const [searchConversation, setsearchConversation] = React.useState("");
  const [searchList, setsearchList] = React.useState(false);
  const [newsearchList, setnewSearchList] = React.useState(false);

  useEffect(() => {
    setnewSearchList(
      conversations.filter((n) => n.title.includes(searchConversation))
    );
    if (searchConversation.length > 0) {
      setsearchList(true);
    } else {
      setsearchList(false);
    }
  }, [searchConversation]);

  let conversationContent = (
    <>
      <NoConversations></NoConversations>
    </>
  );

  if (selectedConversation) {
    conversationContent = (
      <>
        <MessageList
          conversationId={selectedConversation.id}
          selectedConversation={selectedConversation}
        />
      </>
    );
  }

  return (
    <>
      {/* {isAuthenticated? <LogoutButton/> : '' } */}
      <div id="chat-container">
        <ConversationSearch
          searchConversation={searchConversation}
          setsearchConversation={setsearchConversation}
          conversations={conversations}
        />
        {searchList && (
          <ConversationListArchive
            onConversationItemSelected={conversationChanged}
            conversations={newsearchList}
            selectedConversation={selectedConversation}
            conversationRender={conversationRender}
            setconversationRender={setconversationRender}
          />
        )}

        {!searchList && (
          <ConversationListArchive
            onConversationItemSelected={conversationChanged}
            conversations={conversations}
            selectedConversation={selectedConversation}
            conversationRender={conversationRender}
            setconversationRender={setconversationRender}
          />
        )}

        <NewConversation />
        {isLoading ? (
          <div id="loading-layout">
            <div id="loading-content">
              <Loading />
            </div>
          </div>
        ) : (
          <>
            <ChatTitleArchive
              selectedConversation={selectedConversation}
              onDeleteConversation={onDeleteConversation}
              user={user}
            />
            {conversationContent}
            <ChatFormArchive
              selectedConversation={selectedConversation}
              user={user}
              onMessageSubmitted={onMessageSubmitted}
              onMessageUpdate={onMessageUpdate}
              messageDetails={messageDetails}
              sendMessage={sendMessage}
              updateConversationDateMessage={updateConversationDateMessage}
            />
          </>
        )}
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    conversations: state.conversationState.conversations,
    user: state.usersState.userDetails,
    selectedConversation: state.conversationState.selectedConversation,
    messageDetails: state.messagesState.messageDetails,
    isLoading: state.conversationState.isLoading,
  };
};

const mapDispatchToProps = (dispatch) => ({
  conversationChanged: (conversationId) =>
    dispatch(conversationChanged(conversationId)),
  onMessageSubmitted: (messageText, date, time) => {
    dispatch(newMessageAdded(messageText, date, time));
  },
  onMessageUpdate: (
    conversationId,
    messages,
    hasMoreMessages,
    lastMessageId,
    isMyMessage,
    date,
    time
  ) => {
    dispatch(
      updateMessagesDetails(
        conversationId,
        messages,
        hasMoreMessages,
        lastMessageId,
        isMyMessage,
        date,
        time
      )
    );
  },
  sendMessage: (conversationId, messages, email) => {
    dispatch(sendMessage(conversationId, messages, email));
  },
  updateConversation: (conversationId, email, time) => {
    dispatch(updateConversation(conversationId, email, time));
  },
  deletedAddedConversation: (conversationId) => {
    dispatch(deletedAddedConversation(conversationId));
  },
  onDeleteConversation: () => {
    dispatch(conversationDeleted());
  },
  loadConversations: (type) => {
    dispatch(conversationsRequested(type));
  },
  updateConversationDateMessage: (conversationId, messages, date, time) => {
    dispatch(
      updateConversationDateMessage(conversationId, messages, date, time)
    );
  },
  updatedUserCredential: (user) => dispatch(updatedUserCredential(user)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withAuthenticationRequired(ChatShellArchive, {
    onRedirecting: () => <Loading />,
  })
);
