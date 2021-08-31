import React from 'react';
import {useAuth0, withAuthenticationRequired  } from "@auth0/auth0-react";
import ChatShell from './containers/shell/ChatShell';
import Loading from './components/util/Loading';
import { connect } from 'react-redux';
import { updatedUserCredential } from './store/actions';
const App = ({ updatedUserCredential}) => {

  const { user, isAuthenticated } = useAuth0();
  // alert(JSON.stringify(user));
  // console.log(user)
  updatedUserCredential(user);
  const userlogin = async(user) => {
   
    const NODE_API=process.env.REACT_APP_NODE_API
    const URL=`${NODE_API}/api/existuser`
    await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'authorization': AuthStr 
      },
      body: JSON.stringify({ 'user': user })
    })
      .then(response => response.json())
      .then((data) => {
        // alert(JSON.stringify(data));
      })
        .catch((error) => {
            console.error('Error:', error);
        });

    
  }
  

  userlogin(user);
  return (
    <>
      {/* {!isAuthenticated && <LoginButton />}
      {isAuthenticated && <ChatShell /> } */}

      <ChatShell />
      </>
  );
}





const mapStateToProps = state => {
  return {
      user: state.usersState.user,
  };
}; 

const mapDispatchToProps = dispatch => ({
  updatedUserCredential: user => dispatch(updatedUserCredential(user)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withAuthenticationRequired(App, {onRedirecting: () => <Loading />,}));

// export default App;
// export default withAuthenticationRequired(App, {onRedirecting: () => <Loading />,});
