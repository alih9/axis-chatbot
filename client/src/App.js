import React from "react";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import ChatShell from "./containers/shell/ChatShell";
import Loading from "./components/util/Loading";
import { connect } from "react-redux";
import { updatedUserCredential } from "./store/actions";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import io from "socket.io-client";
// var socket = io.connect("http://localhost", { port: 3003 });

const socket = io(process.env.REACT_APP_NODE_API);

// const socket = io.connect("/");
const App = ({ updatedUserCredential }) => {
  const { user, isAuthenticated } = useAuth0();
  const [is_active, setis_active] = React.useState(true);
  // alert(JSON.stringify(user));

  updatedUserCredential(user);

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
        // alert(JSON.stringify(data));
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const addTenant = async () => {
    await userlogin(user);

    await socket.emit("add_active_user", { email: user.email, is_active: 1 });
  };

  React.useEffect(() => {
    console.log(
      `>>>>>>>>>>>>>>>>> app.js ${process.env.REACT_APP_BASE_PATH}/inbox`
    );
    addTenant();
  }, []);

  return (
    <>
      <Router>
        <Switch>
          <Route exact path={`${process.env.REACT_APP_BASE_PATH}/inbox`}>
            <ChatShell socket={socket} type="inbox" />
          </Route>
        </Switch>
      </Router>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.usersState.user,
  };
};

const mapDispatchToProps = (dispatch) => ({
  updatedUserCredential: (user) => dispatch(updatedUserCredential(user)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withAuthenticationRequired(App, { onRedirecting: () => <Loading /> }));

// export default App;
// export default withAuthenticationRequired(App, {onRedirecting: () => <Loading />,});
