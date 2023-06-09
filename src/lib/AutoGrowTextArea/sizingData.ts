/* eslint-disable @typescript-eslint/no-non-null-assertion */
// Attribution to the original author: https://github.com/Andarist/react-textarea-autosize

import * as Effect from "@effect/io/Effect";
import * as O from "@effect/data/Option";

import { pick } from "rambda";
import { pipe } from "@effect/data/Function";

const SIZING_STYLE = [
  "borderBottomWidth",
  "borderLeftWidth",
  "borderRightWidth",
  "borderTopWidth",
  "boxSizing",
  "fontFamily",
  "fontSize",
  "fontStyle",
  "fontWeight",
  "letterSpacing",
  "lineHeight",
  "paddingBottom",
  "paddingLeft",
  "paddingRight",
  "paddingTop",
  // non-standard
  "tabSize",
  "textIndent",
  // non-standard
  "textRendering",
  "textTransform",
  "width",
  "wordBreak",
] as const;

type SizingProps = typeof SIZING_STYLE;
type SizingStyle = Pick<CSSStyleDeclaration, SizingProps[number]>;

export type SizingData = {
  sizingStyle: SizingStyle;
  paddingSize: number;
  borderSize: number;
};

const getSizingData = (node: HTMLElement) =>
  pipe(
    Effect.sync(() => window.getComputedStyle(node)),
    Effect.flatMap(O.fromNullable),
    Effect.flatMap(computedStyles => {
      const sizingStyle = pick(SIZING_STYLE as unknown as string[], computedStyles) as SizingStyle;
      const { boxSizing } = sizingStyle;
      return O.liftPredicate<typeof sizingStyle>(() => boxSizing !== "")(sizingStyle);
    }),
    Effect.map(sizingStyle => {
      const paddingSize =
        parseFloat(sizingStyle.paddingBottom!) + parseFloat(sizingStyle.paddingTop!);

      const borderSize =
        parseFloat(sizingStyle.borderBottomWidth!) +
        parseFloat(sizingStyle.borderTopWidth!);

      return {
        sizingStyle,
        paddingSize,
        borderSize,
      };
    })
  );

export default getSizingData;
