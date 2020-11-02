// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import { ApolloClient } from 'apollo-client'
import {ApolloLink, split} from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { InMemoryCache } from 'apollo-cache-inmemory'
import 'tachyons'
import Vue from 'vue'
import VueApollo from 'vue-apollo'
import App from './App'
import router from './router'
import { USER_ID, AUTH_TOKEN } from './constants/settings'
import {getMainDefinition} from 'apollo-utilities'

Vue.config.productionTip = false

// GraphQL via Apollo
const httpLink = new HttpLink({ uri: 'http://localhost:8081/graphql' })
const wsLink = new WebSocketLink({ uri: 'ws://localhost:8081/graphql' })

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  const token = localStorage.getItem(AUTH_TOKEN)
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : null
    }
  })

  return forward(operation)
})

const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query)
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
  },
  wsLink,
  httpLink
)

const apolloClient = new ApolloClient({
  link: authMiddleware.concat(link),
  cache: new InMemoryCache(),
  connectToDevTools: true
})

Vue.use(VueApollo)

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
  defaultOptions: {
    $loadingKey: 'loading'
  }
})

let userId = localStorage.getItem(USER_ID)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  apolloProvider,
  router,
  data: {
    userId
  },
  components: { App },
  template: '<App/>'
})
