<template>
  <div>
    <div>
      <label>
        Search
        <input type="text" v-model="searchText">
      </label>
    </div>
    <link-item
      v-for="(link, index) in links"
      :key="link.id"
      :link="link"
      :index="index"
    >
    </link-item>
  </div>
</template>

<script>
import { FEED_SEARCH_QUERY } from '../constants/graphql'
import LinkItem from './LinkItem'

export default {
  name: 'Search',
  data () {
    return {
      links: [],
      searchText: ''
    }
  },
  apollo: {
    links: {
      query: FEED_SEARCH_QUERY,
      variables () {
        return {
          searchText: this.searchText
        }
      },
      skip () {
        return !this.searchText
      }
    }
  },
  components: {LinkItem}
}
</script>

<style scoped>

</style>
