# Using The Graph

tldr: It makes data on blockchain accesible via Graphql API. From a dapp developer perspective, it makes querying data exactly the same as querying from any other API.

Smart contracts can implement functions to provide data, but most information is stuck on the blockchain with no fast way of retrieval. Complex queries are even less feasible. The Graph explains how it is a solution here https://thegraph.com/docs/en/about/introduction/.

A "graph node" takes a schema defining the information you want, listens to blockchain events, indexes and stores it in a PostgreSQL database, and exposes a graphql interface. See https://thegraph.com/docs/en/indexing/ for more details.

You need an API key, and pay for queries with GRT (an ERC-20 on Ethereum blockchain).

Take a look at https://thegraph.com/explorer to see deployed subgraphs. You can see their schemas and play around with it to get a better understanding of how to use it.

Here is an example, of using Apollo to handle graphql queries in the context of a React app.

```js
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://gateway.thegraph.com/api/<API_KEY>/subgraphs/id/<SUBGRAPH_ID>",
  cache: new InMemoryCache(),
});

<ApolloProvider client={client}>
  ... components that use apollo context
</ApolloProvider>;
```

```js
const GET_LOCATIONS = gql`
  query GetLocations {
    locations {
      id
      name
      description
      photo
    }
  }
`;

import { useQuery, gql } from "@apollo/client";

const CoolReactComponent = () => {
  const { loading, error, data } = useQuery(GET_LOCATIONS);
};
```
