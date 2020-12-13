import * as express from "express";

export default (req: express.Request, res: express.Response) => {
  req.session.forget();
  res.redirect("/");
};
