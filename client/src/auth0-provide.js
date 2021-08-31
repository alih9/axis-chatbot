import React from "react";
import { useHistory } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";

const Auth0ProviderWithHistory = ({ children }) => {
  const domain = 'siddiquenu.auth0.com';
  const clientId = 'nkmYjUnWhf3gRatsgWnRsZArycOWg12i';
  // alert(domain);
  const history = useHistory();

  const onRedirectCallback = (appState) => {
    console.log(appState)
    history.push(appState?.returnTo || window.location.pathname);
  };

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      redirectUri={window.location.origin}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithHistory;