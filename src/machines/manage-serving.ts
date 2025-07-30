import { setup, type ActorRefFrom } from "xstate";
import { numberFieldActor } from "./number-field";

export const machine = setup({
  types: {
    input: {} as {
      calories: number;
      fatsRatio: number;
      carbohydratesRatio: number;
      proteinsRatio: number;
    },
    context: {} as {
      calories: ActorRefFrom<typeof numberFieldActor>;
      fatsRatio: ActorRefFrom<typeof numberFieldActor>;
      carbohydratesRatio: ActorRefFrom<typeof numberFieldActor>;
      protienRatio: ActorRefFrom<typeof numberFieldActor>;
    },
    events: {} as
      | { type: "plan.update"; id: number }
      | { type: "plan.remove"; id: number }
      | { type: "plan.set"; id: number },
  },
}).createMachine({
  id: "managing-serving",
  context: ({ spawn, input }) => ({
    calories: spawn(numberFieldActor, {
      input: { initialValue: input.calories },
    }),
    fatsRatio: spawn(numberFieldActor, {
      input: { initialValue: input.calories },
    }),
    carbohydratesRatio: spawn(numberFieldActor, {
      input: { initialValue: input.calories },
    }),

    protienRatio: spawn(numberFieldActor, {
      input: { initialValue: input.calories },
    }),
  }),
  initial: "Idle",
  states: {
    Idle: {},
  },
});
