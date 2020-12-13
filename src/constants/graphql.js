import gql from 'graphql-tag'

export const FEED_QUERY = gql`
    query FeedQuery {
        links {
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
            createdAt
            description
            postedBy {
                id
                name
            }
            votes{
                id
                user {
                  id
                }
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

export const UPVOTE_MUTATION = gql`
    mutation UpVoteMutation($linkId: ID!) {
        upVote(linkId: $linkId) {
            id
            link {
                id
                votes {
                    id
                    link {
                      id
                      url
                      description
                      createdAt
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
                    user {
                        id
                    }
                }
            }
            user {
                id
            }
        }
    }
`

export const FEED_SEARCH_QUERY = gql`
    query FeedSearchQuery($searchText: String!) {
      links(OR: [$searchText]) {
        id
        url
        description
        createdAt
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

export const NEW_LINKS_SUBSCRIPTION = gql`
    subscription {
      newLink {
        id
        newLink {
          id
          url
          description
          createdAt
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
    }
`

export const NEW_VOTES_SUBSCRIPTION = gql`
    subscription {
      newVote {
        id
        newVote{
          id
          link {
            id
            url
            description
            createdAt
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
          user {
            id
          }
        }
      }
    }
`
