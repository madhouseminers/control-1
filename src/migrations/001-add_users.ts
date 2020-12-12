import * as argon from "argon2";
import { Pool } from "pg";

export default async (db: Pool) => {
  await db.query(
    "create table users (id SERIAL, email varchar(255) UNIQUE, password varchar(255))"
  );

  await db.query(
    "insert into users (email, password) values ('asdf@asdf.com', $1)",
    [await argon.hash("asdf")]
  );
};
