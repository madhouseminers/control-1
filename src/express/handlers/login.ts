import * as express from "express";
import { User } from "..";
import * as argon from "argon2";

export function get(req: express.Request, res: express.Response) {
  res.render("login", { error: false });
}

export async function post(req: express.Request, res: express.Response) {
  let error = false;
  try {
    // Try and fetch the user from the DB
    const user = await req.app.db.query<User>(
      "select * from users where email=$1",
      [req.body.email]
    );

    // Make sure we matched exactly 1 user
    if (user.rowCount != 1) {
      throw new Error("Invalid username or password");
    }

    // Check password
    if (!(await argon.verify(user.rows[0].password, req.body.password))) {
      throw new Error("Invalid username or password");
    }

    // Set user on the session
    delete user.rows[0].password;
    req.session.user = user.rows[0];

    // Redirect to /dashboard
    return res.redirect("/dashboard");
  } catch (e) {
    error = true;
  }

  res.render("login", { error, email: req.body.email });
}
