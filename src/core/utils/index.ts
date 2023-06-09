import * as M from "@effect/data/typeclass/Monoid";
import { RootElemAttrs } from "../types";

type RootElemAttrsMonoid = {
  [Key in keyof RootElemAttrs]: M.Monoid<RootElemAttrs[Key]>;
};

export function mergeRootElemAttrs(rootElemAttrsObj1: RootElemAttrs) {
  return (rootElemAttrsObj2: RootElemAttrs): RootElemAttrs => {
    const rootElemAttrsMergeMonoid = M.struct<RootElemAttrsMonoid>({
      style: M.string,
      className: M.string,
    });

    return rootElemAttrsMergeMonoid.combine(rootElemAttrsObj1, rootElemAttrsObj2);
  };
}
