import { Data, Effect } from "effect";
import { Pglite } from "./pglite";
import type { PGlite } from "@electric-sql/pglite";

import v0000 from "../drizzle/0000_left_power_pack.sql?raw";

class MigrationsError extends Data.TaggedError("MigrationsError")<{
  cause: unknown;
}> {}

const execute = (client: PGlite) => (sql: string) =>
  Effect.tryPromise({
    try: () => client.exec(sql),
    catch: (error) => new MigrationsError({ cause: error }),
  });

export class Migrations extends Effect.Service<Migrations>()("Migrations", {
  dependencies: [Pglite.Default],
  effect: Effect.gen(function* () {
    const db = yield* Pglite;
    return [execute(db.client)(v0000)] as const;
  }),
}) {}
