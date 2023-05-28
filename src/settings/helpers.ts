/* eslint-disable import/prefer-default-export */
import * as Effect from "@effect/io/Effect";
import * as Option from "@effect/data/Option";
import * as S from "@effect/schema/Schema";

import { pipe } from "@effect/data/Function";
import { AnySchema } from "src/lib/schema";
import { smartStringify } from "src/utils";

export function getItemFromLocalStorageSafely<Sch extends AnySchema>(schema: Sch) {
  return (key: string) =>
    pipe(
      Effect.succeed(undefined),
      Effect.flatMap(() => Option.fromNullable(localStorage.getItem(key))),
      Effect.map(JSON.parse),
      Effect.flatMap(S.parseEffect<unknown, S.To<Sch>>(schema))
    );
}

export function setItemInLocalStorageSafely(key: string) {
  return <Item>(item: Item) =>
    Effect.sync(() => localStorage.setItem(key, smartStringify(item)));
}
