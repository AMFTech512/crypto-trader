import "reflect-metadata";
import { createConnection } from "typeorm";

export function initDB() {
  return createConnection();
}
