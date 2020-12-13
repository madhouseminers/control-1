import * as login from "../handlers/login";
import dashboard from "../handlers/dashboard";
import { requiresAnonymous, requiresLogin } from "./authentication";
import logout from "../handlers/logout";

import * as express from "express";

const router = express.Router();

// Login routes
router.get("/", [requiresAnonymous], login.get);
router.post("/", [requiresAnonymous], login.post);

// Logout route
router.get("/logout", [requiresLogin], logout);

// Dashboard routes
router.get("/dashboard", [requiresLogin], dashboard);

export default router;
