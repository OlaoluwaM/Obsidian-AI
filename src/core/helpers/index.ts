import * as M from "@effect/data/typeclass/Monoid";
import * as S from "@effect/data/typeclass/Semigroup";
import { RootElemAttrs } from "../types";

export function mergeRootElemAttrs(rootElemAttrsObj1: RootElemAttrs) {
  return (rootElemAttrsObj2: RootElemAttrs): RootElemAttrs => {
    const rootElemAttrsMergeMonoid = S.struct({
      style: M.fromSemigroup(S.intercalate("; ")(S.string), ""),
      className: M.fromSemigroup(S.intercalate(" ")(S.string), ""),
      id: S.last<string>(),
    });

    return rootElemAttrsMergeMonoid.combine(rootElemAttrsObj1, rootElemAttrsObj2);
  };
}
