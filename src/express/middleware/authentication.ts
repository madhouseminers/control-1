import * as express from "express";

export function requiresLogin(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  if (!req.session.get("user")) {
    return res.redirect("/");
  }
  next();
}

export function requiresAnonymous(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  if (req.session.user) {
    return res.redirect("/dashboard");
  }
  next();
}
