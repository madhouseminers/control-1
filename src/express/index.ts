import * as express from "express";
import * as helmet from "helmet";
import * as cookies from "cookie-parser";
import * as morgan from "morgan";
import session from "../session";
import db from "../db";
import csrf from "./middleware/csrf";
import router from "./middleware/router";

const app = express();

app.set("view engine", "pug");
app.set("views", "views");
app.set("db", db);

app.use(express.static("static"));
app.use(express.urlencoded({ extended: false }));
app.use(cookies());
app.use(helmet());
// @ts-ignore - not sure why this is causing issues, but it works fine
app.use(morgan("dev"));

app.use(session());
app.use(csrf);
app.use(router);

export interface User {
  id: number;
  email: string;
  password?: string;
}

export default app;
