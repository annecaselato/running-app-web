import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
  from
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import './index.css';
import App from './App';
import { logout } from './logout';
import { ToastContainer, toast } from 'react-toastify';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const httpLink = new HttpLink({ uri: process.env.REACT_APP_API_URI });

const authMiddleware = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('access_token');

  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: token ? 'Bearer ' + token : null
    }
  }));

  return forward(operation);
});

const errorAfterware = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message }) => {
      if (message === 'Unauthorized access') logout();
    });
  }

  if (networkError) {
    toast.error('An Network error occurred', {
      position: toast.POSITION.BOTTOM_CENTER
    });
  }
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: from([authMiddleware, errorAfterware.concat(httpLink)])
});

root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
    <ToastContainer />
  </React.StrictMode>
);
