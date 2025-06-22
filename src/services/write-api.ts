import { Data, Effect, flow, Schema } from "effect";
import { foodTable } from "../schema/drizzle";
import { FoodInsert } from "../schema/food.ts";
import { Pglite } from "./pglite";

class WriteApiError extends Data.TaggedError("WriteApiError")<{
  cause: unknown;
}> {}

export class WriteApi extends Effect.Service<WriteApi>()("WriteApi", {
  dependencies: [Pglite.Default],
  effect: Effect.gen(function* () {
    const { query } = yield* Pglite;
    // 👇 Common middleware function to decode and encode data
    const execute = <A, I, T, E>(
      schema: Schema.Schema<A, I>,
      exec: (values: I) => Effect.Effect<T, E>,
    ) =>
      flow(
        // 👇 Decode the data
        Schema.decode(schema),

        // 👇 Encode the data (if decode succeeds)
        Effect.flatMap(Schema.encode(schema)),
        Effect.tap((encoded) => Effect.log("Insert", encoded)),
        Effect.mapError((error) => new WriteApiError({ cause: error })),

        // 👇 Execute the query
        Effect.flatMap(exec),
      );
    return {
      createFood: execute(FoodInsert, (values) =>
        query((_) => _.insert(foodTable).values(values)),
      ),
    };
  }),
}) {}
