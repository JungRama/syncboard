import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  Observable,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from './cookie-service.utils';
import { clearAllCredentials } from './user-credentials.utils';
import { REFRESH_TOKEN_QUERY } from '@/query/auth.gql';

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPH_URL,
});

const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (operation.operationName === 'RefreshAccessToken') {
      return clearAllCredentials('/auth');
    } else if (graphQLErrors) {
      graphQLErrors.forEach((error) => {
        if (error.extensions.code === 'UNAUTHENTICATED') {
          const observable = new Observable((observer) => {
            (async () => {
              const accessToken = await refreshToken();

              if (!accessToken) {
                return clearAllCredentials('/auth');
              }

              // Retry the failed request
              const subscriber = {
                next: observer.next.bind(observer),
                error: observer.error.bind(observer),
                complete: observer.complete.bind(observer),
              };

              forward(operation).subscribe(subscriber);
            })();
          }).subscribe((val) => {
            return val;
          });

          return observable;
        } else {
          return error;
        }
      });
    }

    if (networkError) console.log(`[Network error]: ${networkError}`);
  },
);

const authLink = setContext((_, { headers }) => {
  const token = getAccessToken();
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const refreshToken = async () => {
  const response = await client.query({
    query: REFRESH_TOKEN_QUERY,
    variables: {
      refreshAccessToken: getRefreshToken(),
    },
  });

  const token = response.data.refreshAccessToken;

  if (token) {
    setAccessToken(token.access_token);
    setRefreshToken(token.refresh_token);
  }

  return token;
};

const client = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  connectToDevTools: true,
});

export default client;
