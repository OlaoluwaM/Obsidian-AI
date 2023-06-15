import SendIcon from "@assets/send.svg";
import AutoGrowTextArea from "@lib/AutoGrowTextArea";

import { makeRenderResourcesForUiComponent } from "@core/index";
import { Settings } from "@settings/index";
import * as Effect from "@effect/io/Effect";
import { useRef } from "react";
import { pipe } from "@effect/data/Function";
import * as O from "@effect/data/Option";
import { m } from "framer-motion";

type AskAiFormInputNames = "ai-prompt";

declare global {
  interface FormData {
    get(name: AskAiFormInputNames): string;
  }
}

interface AskAiProps {
  settings: Settings;
}

function AskAiInput({ settings }: AskAiProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // const formData = new FormData(e.currentTarget);
    // const promptData = formData.get("ai-prompt");
    // await Effect.runPromise(askAi(settings)(promptData));
  };

  const submitOnEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!(e.key === "Enter" && !e.shiftKey)) return;
    e.preventDefault();
    const submitForm = pipe(
      Effect.succeed(formRef.current),
      Effect.flatMap(O.fromNullable),
      Effect.flatMap(formElem => Effect.sync(() => formElem.requestSubmit()))
    );
    Effect.runSync(submitForm);
  };

  return (
    <m.div
      className='ask-ai-input-container'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ ease: "easeOut" }}
    >
      <m.form ref={formRef} onSubmit={handleSubmit} className='ask-ai-input-content'>
        <AutoGrowTextArea
          name={"ai-prompt" satisfies AskAiFormInputNames}
          autoFocus
          rows={1}
          placeholder='Ask AI'
          onKeyDown={submitOnEnter}
        />
        <button type='submit' className='ask-ai-input-submit'>
          <SendIcon />
        </button>
      </m.form>
    </m.div>
  );
}

export const makeRenderResourcesForAskAiInput =
  makeRenderResourcesForUiComponent(AskAiInput);
