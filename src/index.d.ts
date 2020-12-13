import { Pool } from "pg";
import { Session } from "./express/middleware/session";

declare global {
  namespace Express {
    interface Application {
      db: Pool;
    }
    interface Request {
      session?: Session;
    }
  }
}
