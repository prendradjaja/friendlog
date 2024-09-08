import type * as tables from "./raw-database-types";
import type { Selectable, Insertable, Updateable } from "kysely";

// Example: Do this for each table

// export type Book = Selectable<tables.Book>;
// export type NewBook = Insertable<tables.Book>;
// export type BookUpdate = Updateable<tables.Book>;

export type { DB } from "./raw-database-types";
