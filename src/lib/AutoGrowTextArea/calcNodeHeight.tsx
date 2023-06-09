/* eslint-disable no-param-reassign */
// Attribution to the original author: https://github.com/Andarist/react-textarea-autosize

import * as Effect from "@effect/io/Effect";

import { pipe } from "@effect/data/Function";
import getSizingData, { SizingData } from "./sizingData";

type CalculatedNodeHeights = [height: number, rowHeight: number];

function getTextAreaElemHeight(
  textAreaElem: HTMLElement,
  sizingData: SizingData
): number {
  const height = textAreaElem.scrollHeight;

  if (sizingData.sizingStyle.boxSizing === "border-box") {
    // border-box: add border, since height = content + padding + border
    return height + sizingData.borderSize;
  }

  // remove padding, since height = content
  return height - sizingData.paddingSize;
}

export default function calculateNodeHeight(
  hiddenTextAreaElem: HTMLTextAreaElement,
  sizingData: SizingData
) {
  const MIN_ROWS = 1;
  const MAX_ROWS = Infinity;

  return (textAreaElem: HTMLTextAreaElement) =>
    pipe(
      Effect.sync(() => {
        const { paddingSize, borderSize, sizingStyle } = sizingData;
        const { boxSizing } = sizingStyle;

        // To ensure that the visible text area and hidden text area are equal in all sizing properties
        Object.keys(sizingStyle).forEach(_key => {
          const key = _key as keyof typeof sizingStyle;
          hiddenTextAreaElem.style[key] = sizingStyle[key];
        });

        const visibleTextAreaValue = textAreaElem.value;

        hiddenTextAreaElem.value = visibleTextAreaValue;
        let height = getTextAreaElemHeight(hiddenTextAreaElem, sizingData);

        hiddenTextAreaElem.value = "x";
        const rowHeight = hiddenTextAreaElem.scrollHeight - paddingSize;

        let minHeight = rowHeight * MIN_ROWS;

        if (boxSizing === "border-box") {
          minHeight += paddingSize + borderSize;
        }

        height = Math.max(minHeight, height);

        let maxHeight = rowHeight * MAX_ROWS;

        if (boxSizing === "border-box") {
          maxHeight += paddingSize + borderSize;
        }

        height = Math.min(maxHeight, height);

        return [height, rowHeight] satisfies CalculatedNodeHeights;
      })
    );
}
