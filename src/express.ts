import * as express from "express";
import * as helmet from "helmet";
import * as cookies from "cookie-parser";
import * as morgan from "morgan";
import session from "./session";
import * as randomstring from "randomstring";
import db from "./db";
import { Pool } from "pg";
import * as argon from "argon2";

const app = express();
app.use(express.static("static"));
app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(cookies());
app.use(morgan("dev"));
app.set("view engine", "pug");
app.set("views", "views");

app.set("db", db);

app.use(session());
// CSRF Check
app.use((req, res, next) => {
  if (
    req.body.csrf_token &&
    req.body.csrf_token != req.session.get("csrf_token")
  ) {
    req.session.remove("csrf_token");
    return res.sendStatus(400);
  }
  req.session.remove("csrf_token");
  next();
});

app.get(
  "/",
  [requiresAnonymous],
  (req: express.Request, res: express.Response) => {
    const csrf_token = randomstring.generate();
    req.session.set("csrf_token", csrf_token);
    res.render("login", { csrf_token, error: false });
  }
);

export interface User {
  id: number;
  email: string;
  password?: string;
}

app.post(
  "/",
  [requiresAnonymous],
  async (req: express.Request, res: express.Response) => {
    let error = false;
    try {
      // Try and fetch the user from the DB
      const user = await (req.app.get("db") as Pool).query<User>(
        "select * from users where email=$1",
        [req.body.email]
      );

      // Make sure we matched exactly 1 user
      if (user.rowCount != 1) {
        throw new Error("Invalid username or password");
      }

      // Check password
      if (!argon.verify(user.rows[0].password, req.body.password)) {
        throw new Error("Invalid username or password");
      }

      // Set user on the session
      delete user.rows[0].password;
      req.session.set("user", user.rows[0]);

      // Redirect to /dashboard
      return res.redirect("/dashboard");
    } catch (e) {
      error = true;
    }

    const csrf_token = randomstring.generate();
    req.session.set("csrf_token", csrf_token);
    res.render("login", { csrf_token, error });
  }
);

app.get(
  "/dashboard",
  [requiresLogin],
  (req: express.Request, res: express.Response) => {
    res.render("dashboard", { user: req.session.get("user") });
  }
);

function requiresLogin(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  if (!req.session.get("user")) {
    return res.redirect("/");
  }
  next();
}

function requiresAnonymous(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  if (req.session.get("user")) {
    return res.redirect("/dashboard");
  }
  next();
}

app.get(
  "/logout",
  [requiresLogin],
  async (req: express.Request, res: express.Response) => {
    await req.session.forget();
    console.log("FLUSHED");
    res.redirect("/");
  }
);

export default app;
