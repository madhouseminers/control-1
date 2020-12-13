import * as express from "express";
import * as cookies from "cookie-parser";
import * as morgan from "morgan";
import session from "./middleware/session";
import db from "../db";
import router from "./middleware/router";

const app = express();

app.set("view engine", "pug");
app.set("views", "views");
app.db = db;

app.disable("x-powered-by");
app.use(express.static("static"));
app.use(express.urlencoded({ extended: false }));
app.use(cookies());
// @ts-ignore - not sure why this is causing issues, but it works fine
app.use(morgan("dev"));

app.use(session());
app.use(router);

export interface User {
  id: number;
  email: string;
  password?: string;
}

export default app;
