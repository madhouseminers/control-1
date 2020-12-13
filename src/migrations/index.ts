import * as dotenv from "dotenv";
dotenv.config();

import * as fs from "fs";
import * as path from "path";
import db from "../db";

function getAllMigrations() {
  return fs
    .readdirSync(__dirname)
    .filter((n) => n !== path.basename(__filename));
}

async function getExistingMigrations() {
  return (await db.query("select * from migrations")).rows.map((r) => r.name);
}

async function createMigrationTable() {
  await db.query("create table if not exists migrations (name varchar(255))");
}

async function runMigration(migration: string) {
  const m = require(`./${migration}`).default;
  await m(db);
  await db.query("insert into migrations (name) values ($1)", [migration]);
}

async function run() {
  await createMigrationTable();
  const allMigrations = getAllMigrations();
  const existingMigrations = await getExistingMigrations();
  console.log(allMigrations, existingMigrations);

  const runnableMigrations = allMigrations.filter(
    (m) => !existingMigrations.includes(m)
  );

  for (const m of runnableMigrations) {
    await runMigration(m);
  }

  process.exit(0);
}

run();
