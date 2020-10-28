<template>
    <div>
        <div class="flex flex-column mt3">
            <input
                type="text"
                v-model="description"
                placeholder="A description for the link"
                class="mb2"
            >
            <input
                class="mb2"
                v-model="url"
                type="text"
                placeholder="The URL for the link"
            >
        </div>
        <button @click="createLink()">Submit</button>
    </div>
</template>

<script>
import { CREATE_LINK_MUTATION, FEED_QUERY } from '../constants/graphql'
import { USER_ID } from '../constants/settings'

export default {
  name: 'CreateLink',
  data () {
    return {
      url: '',
      description: ''
    }
  },
  methods: {
    createLink () {
      const postedBy = localStorage.getItem(USER_ID)
      if (!postedBy) {
        console.error('No user logged in')
        return
      }

      const newDescription = this.description
      const newUrl = this.url
      this.description = ''
      this.url = ''

      this.$apollo.mutate({
        mutation: CREATE_LINK_MUTATION,
        variables: {
          url: newUrl,
          description: newDescription
        },
        update: (store, { data: { post } }) => {
          const data = store.readQuery({
            query: FEED_QUERY
          })
          data.links.push(post)
          store.writeQuery({ query: FEED_QUERY, data })
        }
      }).then((data) => {
        this.$router.push({path: '/'})
      }).catch((error) => {
        console.error(error)
        this.newDescription = newDescription
        this.newUrl = newUrl
      })
    }
  }
}
</script>
