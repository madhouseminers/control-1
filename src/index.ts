/// <reference path="./index.d.ts" />

import * as dotenv from "dotenv";
dotenv.config();

import * as http from "http";
import app from "./express";
import graphql from "./graphql";

// Apply the GraphQL server
graphql(app);

const server = http.createServer(app);
const port = process.env.PORT || 2111;
server.listen(port, () => {
  const address = server.address();
  if (!address) {
    console.log(`Listening on http://127.0.0.1:${port}/`);
  } else if (typeof address === "string") {
    console.log(`Listening on http://${address}/`);
  } else {
    console.log(`Listening on http://127.0.0.1:${address.port}/`);
  }
});
