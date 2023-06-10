import * as Effect from "@effect/io/Effect";

import { pipe } from "@effect/data/Function";
import { ComponentPropsWithRef, forwardRef, useEffect, useRef } from "react";

import calculateNodeHeight from "./calcNodeHeight";
import getSizingData, { SizingData } from "./sizingData";

// NOTE: We could perhaps look into making this a custom HTML element via web components
type AutoGrowTextAreaProps = ComponentPropsWithRef<"textarea">;

const AutoGrowTextArea = forwardRef<HTMLTextAreaElement, AutoGrowTextAreaProps>(
  (props, ref) => {
    const heightRef = useRef(0);
    const sizingDataCache = useRef<SizingData>();

    useEffect(() => {
      sizingDataCache.current = Effect.runSync(
        Effect.flatMap(
          // Disabled because this element will always exist within this context
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          Effect.sync(() => document.getElementById("auto-grow-text-area")!),
          getSizingData
        )
      );
    }, []);

    const resizeTextArea = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      // prettier-ignore
      const hiddenTextArea = event.currentTarget.nextElementSibling as HTMLTextAreaElement;

      return pipe(
        event.currentTarget,
        // Disabled because this will always be set before the enclosing function is run
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        calculateNodeHeight(hiddenTextArea, sizingDataCache.current!),
        Effect.flatMap(([height]) => {
          const textAreaElem = event.currentTarget;

          if (heightRef.current !== height) {
            heightRef.current = height;
            textAreaElem.style.setProperty("height", `${height}px`, "important");
          }

          return Effect.succeed("Success");
        })
      );
    };

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) =>
      Effect.runSync(resizeTextArea(event));

    return (
      <>
        <textarea {...props} id='auto-grow-text-area' ref={ref} onChange={handleChange} />
        <textarea tabIndex={-1} aria-hidden id='auto-grow-text-area-helper-elem' />
      </>
    );
  }
);

export default AutoGrowTextArea;
