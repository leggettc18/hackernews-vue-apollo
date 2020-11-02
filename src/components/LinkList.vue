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
import {FEED_QUERY, NEW_LINKS_SUBSCRIPTION} from '../constants/graphql'

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
            if (!subscriptionData.data.newLink) return

            const newLinks = [
              subscriptionData.data.newLink,
              ...previous.links
            ]
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
