import * as express from "express";

export default (req: express.Request, res: express.Response) => {
  res.render("dashboard", { user: req.session.user });
};
