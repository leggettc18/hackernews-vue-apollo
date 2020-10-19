import gql from 'graphql-tag'

export const FEED_QUERY = gql`
    query FeedQuery {
        feed {
            id
            createdAt
            url
            description
            postedBy {
                id
                name
            }
            votes {
                id
                user {
                    id
                }
            }
        }
    }
`

export const CREATE_LINK_MUTATION = gql`
    mutation CreateLinkMutation($url: String!, $description: String!) {
        post(
            url: $url,
            description: $description
        ) {
            id
            url
            description
            postedBy {
                id
                name
            }
        }
    }
`

export const SIGNUP_USER_MUTATION = gql`
    mutation SignUpUserMutation($name: String!, $email: String!, $password: String!) {
        signup(
            name: $name,
            email: $email,
            password: $password
        ) {
            token
            user {
                id
            }
        }
    }
`

export const LOGIN_USER_MUTATION = gql`
    mutation LoginUserMutation($email: String!, $password: String!) {
        login(
            email: $email,
            password: $password
        ) {
            token
            user {
                id
            }
        }
    }
`
