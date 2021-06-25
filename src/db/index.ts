import "reflect-metadata";
import { createConnection } from "typeorm";

export function initDB() {
  return createConnection();
}

export function initTestDB(database: string = ":memory:") {
  return createConnection({
    type: "sqlite",
    database,
    entities: ["src/entities/**/*.entity.ts"],
    synchronize: true,
    dropSchema: true,
  });
}
