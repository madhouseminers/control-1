import * as express from "express";
import * as randomstring from "randomstring";
import * as redis from "redis";
import { promisify } from "util";
import { User } from "..";

interface SessionData {
  user?: User;
}

const redis_client = redis.createClient(
  process.env.REDIS_URL || "redis://localhost:6379/1"
);
const redis_get = promisify(redis_client.get).bind(redis_client);
const redis_set = promisify(redis_client.set).bind(redis_client);
const redis_del = promisify(redis_client.del).bind(redis_client);
const redis_exp = promisify(redis_client.expire).bind(redis_client);

export class Session {
  id: string;
  data: SessionData;

  async save() {
    await redis_set(this.id, JSON.stringify(this.data));
    await redis_exp(this.id, 1800);
  }

  async load(id: string) {
    let data: string;
    if (id) {
      data = await redis_get(id);
    }
    if (!data) {
      this.data = {};
      this.id = randomstring.generate();
    } else {
      this.data = JSON.parse(data);
      this.id = id;
    }
  }

  set(key: string, value: any) {
    this.data[key] = value;
    this.save();
  }

  get(key: string) {
    return this.data[key];
  }

  remove(key: string) {
    delete this.data[key];
    this.save();
  }

  forget() {
    redis_del(this.id);
    this.id = randomstring.generate();
    this.data = {};
  }
}

export default () => {
  return async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const session = new Session();
    await session.load(req.cookies.session);
    req.session = session;
    res.cookie("session", session.id);

    next();
  };
};
