import { pipe } from "@effect/data/Function";
import * as S from "@effect/schema/Schema";
import * as Effect from "@effect/io/Effect";

import { OPENAI_API_URL_BASE } from "@utils/constants";

type OPENAI_API_URL_BASE = typeof OPENAI_API_URL_BASE;

// We will include others, but for now this enough
type SUPPORTED_OPENAI_API_URLS = `${OPENAI_API_URL_BASE}/chat/completions`;

const allOpenAiChatMessagesRolesSchema = S.union(
  S.literal("system", "assistant", "user")
);
const useableOpenAiChatMessageRolesSchema = S.union(S.literal("assistant", "user"));

type AllOpenAiChatMessageRoles = S.To<typeof allOpenAiChatMessagesRolesSchema>;
type UseableOpenAiChatMessageRoles = S.To<typeof useableOpenAiChatMessageRolesSchema>;

const openAiChatMessageFmtSchema = S.struct({
  role: useableOpenAiChatMessageRolesSchema,
  content: pipe(S.string, S.nonEmpty<string>()),
});

type OpenAiChatMessageFmt = S.To<typeof openAiChatMessageFmtSchema>;

const openAiChatSystemMessageFmtSchema = S.struct({
  role: S.literal("system"),
  content: pipe(S.string, S.nonEmpty<string>()),
});

type OpenAiChatSystemMessageFmt = S.To<typeof openAiChatSystemMessageFmtSchema>;

const openAiChatModelsSchema = S.union(S.literal("gpt-3.5-turbo"), S.literal("gpt-4"));

type OpenAiChatModels = S.To<typeof openAiChatModelsSchema>;

const openAiChatApiReqSchema = S.struct({
  messages: pipe(
    S.tuple(openAiChatSystemMessageFmtSchema),
    S.rest(openAiChatMessageFmtSchema)
  ),
  model: openAiChatModelsSchema,
  n: S.optional(pipe(S.number, S.positive<number>())),
  frequencyPenalty: S.optional(pipe(S.number, S.between<number>(-2, 2))),
  presencePenalty: S.optional(pipe(S.number, S.between<number>(-2, 2))),
});

type OpenAiChatApiReq = S.To<typeof openAiChatApiReqSchema>;

type OpenAiChatApiReqDeps = {
  openAiApiKey: string;
  apiBody: OpenAiChatApiReq;
};

export function foo(apiURL: SUPPORTED_OPENAI_API_URLS) {}

export function bar(apiURL: SUPPORTED_OPENAI_API_URLS) {
  return (apiReqDeps: OpenAiChatApiReqDeps) => {
    const { openAiApiKey, apiBody } = apiReqDeps;
    return pipe(
      apiBody,
      S.parseEffect(openAiChatApiReqSchema),
      Effect.flatMap(reqBody => {
        const { frequencyPenalty, presencePenalty, ...restOfReqBody } = reqBody;

        return Effect.tryCatchPromise(
          () =>
            fetch(apiURL, {
              headers: {
                Authorization: `Bearer ${openAiApiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                ...restOfReqBody,
                stream: true,
                frequency_penalty: frequencyPenalty,
                presence_penalty: presencePenalty,
              }),
              method: "POST",
            }),
          reason =>
            new OpenAiChatApiReqError(
              `Error occurred while streaming Chat AI response: ${reason}`
            )
        );
      })
    );
  };
}

class OpenAiChatApiReqError extends Error {
  readonly _tag = "OpenAiChatApiReqError";

  constructor(readonly error: string) {
    super(error);
  }
}
