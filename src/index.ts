import * as dotenv from "dotenv";
dotenv.config();

import * as http from "http";
import { AddressInfo } from "net";
import app from "./express";
import graphql from "./graphql";

// Apply the GraphQL server
graphql(app);

const server = http.createServer(app);
server.listen(process.env.PORT || 2111, () => {
  const address = server.address() as AddressInfo;
  console.log(`Listening on http://127.0.0.1:${address.port}/`);
});
