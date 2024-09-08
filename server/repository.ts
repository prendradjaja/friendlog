import { Kysely } from "kysely";
import { DB } from "./database-types";

export class Repository {
  constructor(private db: Kysely<DB>) {}
}
