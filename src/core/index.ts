import * as Effect from "@effect/io/Effect";

import { pipe } from "@effect/data/Function";

import { AnyObject } from "@typelevel/index";
import { mergeRootElemAttrs } from "./helpers";

type ReactComponent = (props: AnyObject) => JSX.Element;

export interface RootElemAttrs {
  style: string;
  className: string;
  id: string;
}

const EMPTY_ROOT_ATTRS: RootElemAttrs = {
  style: "",
  className: "",
  id: "",
};

// NOTE: This relationship is temporary
const DEFAULT_ROOT_ATTRS: RootElemAttrs = EMPTY_ROOT_ATTRS;

const mergeWithDefaultRootElemAttrs = mergeRootElemAttrs(DEFAULT_ROOT_ATTRS);

export function makeRenderResourcesForUiComponent<Comp extends ReactComponent>(
  UIComponent: Comp
) {
  return (rootAttrs: Partial<RootElemAttrs> = {}) =>
    pipe(
      Effect.Do(),
      Effect.bind("rootElem", () => createUIComponentRootElem(rootAttrs)),
      Effect.let("UI", () => UIComponent)
    );
}

function createUIComponentRootElem(rootAttrs: Partial<RootElemAttrs> = {}) {
  return Effect.sync(() => {
    const rootElem = Object.assign(
      document.createElement("div"),
      mergeWithDefaultRootElemAttrs({ ...EMPTY_ROOT_ATTRS, ...rootAttrs })
    );

    addEventListenersToRootElem(rootElem);

    document.body.appendChild(rootElem);
    return rootElem;
  });
}
function addEventListenersToRootElem(rootElem: HTMLElement) {
  const rootUnmountEvent = new Event("root:unmount", { bubbles: true });

  rootElem.addEventListener("click", e => e.stopPropagation());
  rootElem.addEventListener("keydown", evt => {
    if (evt.key !== "Escape") return;
    rootElem.dispatchEvent(rootUnmountEvent);
  });
}
