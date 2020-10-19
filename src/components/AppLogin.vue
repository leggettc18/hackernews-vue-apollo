<template>
    <div>
        <h4 class="mv3">{{login ? 'login' : 'Sign Up'}}</h4>
        <div class="flex flex-column">
            <input
                v-show="!login"
                v-model="name"
                type="text"
                placeholder="Your name"
            >
            <input
                v-model="email"
                type="text"
                placeholder="Your email address"

            >
            <input
                v-model="password"
                type="password"
                placeholder="Password"
            >
        </div>
        <div class="flex mt3">
            <button
                type="button"
                class="pointer mr2 button"
                @click="confirm()"
            >
                {{login ? 'login' : 'create account'}}
            </button>
            <button
                type="button"
                class="pointer button"
                @click="login = !login"
            >
                {{login ? 'need to create an account?' : 'already have an account?'}}
            </button>
        </div>
    </div>
</template>

<script>
import { SIGNUP_USER_MUTATION, LOGIN_USER_MUTATION } from '../constants/graphql'
import { USER_ID, AUTH_TOKEN } from '../constants/settings'
export default {
  name: 'AppLogin',
  data () {
    return {
      email: '',
      login: true,
      name: '',
      password: ''
    }
  },
  methods: {
    confirm () {
      const { name, email, password } = this.$data
      if (this.login) {
        this.$apollo.mutate({
          mutation: LOGIN_USER_MUTATION,
          variables: {
            email,
            password
          }
        }).then((result) => {
          const id = result.data.login.user.id
          const token = result.data.login.token
          this.saveUserData(id, token)
        }).catch((error) => {
          alert(error)
        })
      } else {
        this.$apollo.mutate({
          mutation: SIGNUP_USER_MUTATION,
          variables: {
            name,
            email,
            password
          }
        }).then((result) => {
          const id = result.data.signup.user.id
          const token = result.data.signup.token
          this.saveUserData(id, token)
        }).catch((error) => {
          alert(error)
        })
      }
      this.$router.push({path: '/'})
    },
    saveUserData (id, token) {
      localStorage.setItem(USER_ID, id)
      localStorage.setItem(AUTH_TOKEN, token)
      this.$root.$data.userId = localStorage.getItem(USER_ID)
    }
  }
}
</script>
