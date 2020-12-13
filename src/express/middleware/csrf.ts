import * as express from "express";

export default (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (
    req.body.csrf_token &&
    req.body.csrf_token != req.session.get("csrf_token")
  ) {
    req.session.remove("csrf_token");
    return res.sendStatus(400);
  }
  req.session.remove("csrf_token");
  next();
};
