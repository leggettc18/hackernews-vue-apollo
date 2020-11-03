<template>
    <div>
        <h4 v-if="loading">Loading...</h4>
        <link-item
            v-for="(link, index) in links"
            :key ="link.id"
            :link="link"
            :index="index"
        >
        </link-item>
    </div>
</template>

<script>
import LinkItem from './LinkItem'
import {FEED_QUERY, NEW_LINKS_SUBSCRIPTION, NEW_VOTES_SUBSCRIPTION} from '../constants/graphql'

export default {
  name: 'LinkList',
  data () {
    return {
      links: [],
      loading: 0
    }
  },
  components: {
    LinkItem
  },
  apollo: {
    links: {
      query: FEED_QUERY,
      subscribeToMore: [
        {
          document: NEW_LINKS_SUBSCRIPTION,
          updateQuery: (previous, {subscriptionData}) => {
            if (!subscriptionData.data.newLink.newLink) return

            const newLinks = [
              subscriptionData.data.newLink.newLink,
              ...previous.links
            ]
            return {
              ...previous,
              links: newLinks
            }
          }
        },
        {
          document: NEW_VOTES_SUBSCRIPTION,
          updateQuery: (previous, { subscriptionData }) => {
            if (!subscriptionData.data.newVote.newVote) return

            const votedLinkIndex = previous.links.findIndex(link => link.id === subscriptionData.data.newVote.newVote.link.id)
            const link = subscriptionData.data.newVote.newVote.link
            const newLinks = previous.links.slice()
            console.log(newLinks)
            newLinks[votedLinkIndex] = link
            console.log(link)
            console.log(newLinks)
            return {
              ...previous,
              links: newLinks
            }
          }
        }
      ]
    }
  }
}
</script>
