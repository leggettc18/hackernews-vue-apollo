<template>
    <div>
        <h4 v-if="loading">Loading...</h4>
        <link-item
            v-for="link in feed"
            :key ="link.id"
            :link="link"
        >
        </link-item>
    </div>
</template>

<script>
import LinkItem from './LinkItem'
import { FEED_QUERY } from '../constants/graphql'

export default {
  name: 'LinkList',
  data () {
    return {
      feed: [],
      loading: 0
    }
  },
  components: {
    LinkItem
  },
  apollo: {
    feed: {
      query: FEED_QUERY
    }
  }
}
</script>
