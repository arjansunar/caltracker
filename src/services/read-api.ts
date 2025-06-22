import { Effect } from "effect";
import { Pglite } from "./pglite";
import { planTable } from "../schema/drizzle";
import { eq } from "drizzle-orm";

export class ReadApi extends Effect.Service<ReadApi>()("ReadApi", {
  dependencies: [Pglite.Default],
  effect: Effect.gen(function* () {
    const { query } = yield* Pglite;
    return {
      getCurrentPlan: query((_) =>
        _.select()
          .from(planTable)
          .where(eq(planTable.isCurrent, true))
          .limit(1),
      ),
    };
  }),
}) {}
