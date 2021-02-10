<template>
  <div>
    <div>
        <h4 v-if="loading">Loading...</h4>
        <link-item
            v-for="(link, index) in orderedLinks"
            :key ="link.id"
            :link="link"
            :index="index"
            :pageNumber="pageNumber"
        >
        </link-item>
    </div>
    <div v-if="isNewPage">
      <button v-show="!isFirstPage" @click="previousPage()">Previous</button>
      <button v-show="morePages" @click="nextPage()">Next</button>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import LinkItem from './LinkItem'
import {FEED_QUERY, NEW_LINKS_SUBSCRIPTION, NEW_VOTES_SUBSCRIPTION} from '../constants/graphql'
import {LINKS_PER_PAGE} from '../constants/settings'

export default {
  name: 'LinkList',
  data () {
    return {
      links: [],
      count: 0,
      loading: 0
    }
  },
  components: {
    LinkItem
  },
  methods: {
    getLinksToRender (isNewPage) {
      if (isNewPage) {
        return this.$apollo.queries.links
      }
      const rankedLinks = this.$apollo.queries.links.slice
      rankedLinks.sort((l1, l2) => l2.votes.length - l1.votes.length)
      return rankedLinks
    },
    nextPage () {
      const page = parseInt(this.$route.params.page, 10)
      if (page < this.count / LINKS_PER_PAGE) {
        // eslint-disable-next-line no-unused-vars
        const nextPage = page + 1
        this.$router.push({path: `/new/${nextPage}`})
      }
    },
    previousPage () {
      const page = parseInt(this.$route.params.page, 10)
      if (page > 1) {
        // eslint-disable-next-line no-unused-vars
        const previousPage = page - 1
        this.$router.push({path: `/new/${previousPage}`})
      }
    }
  },
  computed: {
    orderedLinks: function () {
      if (this.$route.path.includes('top')) {
        return _.orderBy(this.links, 'votes.length').reverse()
      } else {
        return this.links
      }
    },
    isFirstPage () {
      return this.$route.params.page === '1'
    },
    isNewPage () {
      return this.$route.path.includes('new')
    },
    pageNumber (index) {
      return parseInt(this.$route.params.page, 10)
    },
    morePages () {
      return parseInt(this.$route.params.page, 10) < this.count / LINKS_PER_PAGE
    }
  },
  apollo: {
    links: {
      query: FEED_QUERY,
      variables () {
        const page = parseInt(this.$route.params.page, 10)
        const isNewPage = this.$route.path.includes('new')
        const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0
        const first = isNewPage ? LINKS_PER_PAGE : 100
        const orderBy = isNewPage ? 'createdAt_DESC' : null
        return {
          first,
          skip,
          orderBy
        }
      },
      update (data) {
        this.count = data.linksMeta.count
        return data.links
      },
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
              links: newLinks.slice(0, LINKS_PER_PAGE)
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
            newLinks[votedLinkIndex] = link
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
