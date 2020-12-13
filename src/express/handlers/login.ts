import * as express from "express";
import * as randomstring from "randomstring";
import { Pool } from "pg";
import { User } from "..";
import * as argon from "argon2";

export function get(req: express.Request, res: express.Response) {
  const csrf_token = randomstring.generate();
  req.session.set("csrf_token", csrf_token);
  res.render("login", { csrf_token, error: false });
}

export async function post(req: express.Request, res: express.Response) {
  let error = false;
  try {
    // Try and fetch the user from the DB
    const user = await (req.app.get("db") as Pool).query<User>(
      "select * from users where email=$1",
      [req.body.email]
    );

    console.log(user);

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
    console.log(e);
    error = true;
  }

  const csrf_token = randomstring.generate();
  req.session.set("csrf_token", csrf_token);
  res.render("login", { csrf_token, error });
}
