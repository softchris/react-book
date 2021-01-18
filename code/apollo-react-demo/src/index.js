import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import registerServiceWorker from './registerServiceWorker';

const client = new ApolloClient({ uri: 'http://localhost:55587' /*'https://nx9zvp49q7.lp.gql.zone/graphql'*/ });

const ApolloApp = AppComponent => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

ReactDOM.render(<ApolloApp />, document.getElementById('root'));
registerServiceWorker();
