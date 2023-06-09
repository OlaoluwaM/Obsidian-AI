import * as Effect from "@effect/io/Effect";

import { pipe } from "@effect/data/Function";
import { RootElemAttrs } from "./types";
import { mergeRootElemAttrs } from "./utils";

export * from "./types";

const EMPTY_ROOT_ATTRS: RootElemAttrs = {
  style: "",
  className: "",
};

// NOTE: This relationship is temporary
const DEFAULT_ROOT_ATTRS: RootElemAttrs = EMPTY_ROOT_ATTRS;

const mergeWithDefaultRootElemAttrs = mergeRootElemAttrs(DEFAULT_ROOT_ATTRS);

export function makeRenderResourcesForUiComponent(UIComponent: () => JSX.Element) {
  return (rootAttrs: Partial<RootElemAttrs> = {}) =>
    pipe(
      Effect.Do(),
      Effect.let("rootElem", () => {
        const rootElem = Object.assign(
          document.createElement("div"),
          mergeWithDefaultRootElemAttrs({ ...EMPTY_ROOT_ATTRS, ...rootAttrs })
        );
        document.body.appendChild(rootElem);
        return rootElem;
      }),
      Effect.let("UI", () => UIComponent)
    );
}
