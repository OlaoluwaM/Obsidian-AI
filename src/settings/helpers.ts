/* eslint-disable import/prefer-default-export */
import * as Effect from "@effect/io/Effect";
import * as O from "@effect/data/Option";
import * as S from "@effect/schema/Schema";

import { pipe } from "@effect/data/Function";
import { AnySchema } from "@lib/schema";
import { smartStringify } from "@utils/index";

export function getItemFromLocalStorageSafely<Sch extends AnySchema>(schema: Sch) {
  return (key: string) =>
    pipe(
      Effect.sync(() => localStorage.getItem(key)),
      Effect.flatMap(O.fromNullable),
      Effect.map(JSON.parse),
      Effect.flatMap(S.parseEffect<unknown, S.To<Sch>>(schema))
    );
}

export function setItemInLocalStorageSafely(key: string) {
  return <Item>(item: Item) =>
    Effect.sync(() => localStorage.setItem(key, smartStringify(item)));
}
