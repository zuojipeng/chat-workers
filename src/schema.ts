import { makeExecutableSchema } from '@graphql-tools/schema'

const typeDefs = /* GraphQL */ `
  type Message {
    id: ID!
    role: String!
    content: String!
  }

  type Query {
    # This query is not implemented in this version.
    # You can extend the worker to store and retrieve conversation history.
    placeholder: String
  }

  type Mutation {
    postMessage(content: String!): Message!
  }
`

export default typeDefs
