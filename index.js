import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./db/db.js";
import bodyParser from "body-parser";

import gql from "graphql-tag";
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import resolvers from "./graphql/resolvers.js";
import { readFileSync } from "fs";

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);

const typeDefs = gql(
  readFileSync("./graphql/schema.graphql", {
    encoding: "utf-8",
  })
);

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

await server.start();

app.use(
  '/graphql',
  cors(),
  bodyParser.json(),
  expressMiddleware(server, {
    context: async ({ req, res }) => ({ req, res })
  })
);

try {
  const port = process.env.PORT || 4000;
  await connectDB();
  app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}/graphql`);
  });
} catch (error) {
  console.error(`❌ Error starting the server:`, error);
}
