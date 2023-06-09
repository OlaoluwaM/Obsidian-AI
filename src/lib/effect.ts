import * as Effect from "@effect/io/Effect";

export function effectTap<A>(f: (arg: A) => void) {
  return <R, E>(prevEffect: Effect.Effect<R, E, A>) =>
    Effect.flatMap(prevEffect, v => {
      f(v);
      return Effect.succeed(v);
    });
}
