/* eslint-disable import/prefer-default-export */
import * as Effect from "@effect/io/Effect";
import * as O from "@effect/data/Option";

import { pipe } from "@effect/data/Function";
import { Notice } from "obsidian";

export function sendNotificationStr(message: string, duration?: number) {
  return new Notice(message, duration);
}

export function getPositionOfCurrentActiveLine() {
  const DEFAULT_DOM_RECT: DOMRect = {
    bottom: 0,
    height: 0,
    left: 0,
    right: 0,
    top: 0,
    width: 0,
    x: 0,
    y: 0,
    toJSON: () => JSON.stringify(this),
  };

  return pipe(
    Effect.sync(() => document.querySelector("div.cm-editor div.cm-active")),
    Effect.flatMap(O.fromNullable),
    Effect.map(editorActiveLine => editorActiveLine.getBoundingClientRect()),
    Effect.catchAll(() => Effect.succeed(DEFAULT_DOM_RECT))
  );
}
