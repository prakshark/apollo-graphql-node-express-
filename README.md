
# Apollo GraphQL typeDefs and Query (No Mutations) Endpoints 

GraphQL helps to create a single endpoint that can be used for custom queries, including queries(GET) and Mutations(POST, PATCH, DELETE).

We use Apollo GraphQL, which is a graphQL librarys, better than raw graphQL.

PS: There are some compatibility issues with express. So refer to this package.json :

        {
        "name": "graphql-auth",
        "version": "1.0.0",
        "type": "module",
        "scripts": {
            "dev": "nodemon index.js"
        },
        "dependencies": {
            "@apollo/server": "^4.12.2",
            "bcrypt": "^6.0.0",
            "body-parser": "^2.2.0",
            "cookie": "^1.0.2",
            "cors": "^2.8.5",
            "dotenv": "^17.2.1",
            "express": "^5.1.0",
            "graphql": "^16.11.0",
            "graphql-tag": "^2.12.6",
            "jsonwebtoken": "^9.0.2",
            "mongoose": "^8.17.0"
        }
        }

- Create a seperate directory by the name ```graphql``` in root and add ```schema.graphql``` and ```resolvers.js```
- Add the data type definitions and query names and return trypes in the ```schema.graphql```(Mutations not covered right now).
- In ```resolvers.js```, define the resolvers(controllers) for each of the query mentioned earlier in the ```schema.graphql```.
- In ```index.js```, import :
    ```
    import gql from "graphql-tag";
    import { ApolloServer } from '@apollo/server';
    import { expressMiddleware } from '@apollo/server/express4';
    import resolvers from "./graphql/resolvers.js";
    import { readFileSync } from "fs";
    ```
- Read the schema in ```index.js``` using the fs module :
    ```
    const typeDefs = gql(
        readFileSync("./graphql/schema.graphql", {
            encoding: "utf-8",
        })
    );
    ```
- Create and start a new Apollo Server :
    ```
    const server = new ApolloServer({
    typeDefs,
    resolvers,
    });

    await server.start();
    ```
- Create the graphQL endpoint :
    ```
    app.use(
    '/graphql',
    cors(),
    bodyParser.json(),
    expressMiddleware(server, {
        context: async ({ req, res }) => ({ req, res })
    })
    );
    ```
- For query in Postman:
    ```
    {
    "query": "query { allProfiles { name email } }"
    }

    ```
    ```
    {
    "query": "query { profile(id: \"_id of the user\") { name email } }"
    }
    ```
PS: We use (```\"```) instead of (") in postman, so that it seperates the inner content, since the (") are also inside other pair of (")

PS: Make requests in Postman as POST requests, instead of graphiQL, since that may have some issues when there are database calls, etc.
