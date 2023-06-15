import * as Eq from "@effect/data/typeclass/Equivalence";
import * as Effect from "@effect/io/Effect";
import * as Schema from "@effect/schema/Schema";

import { pipe } from "@effect/data/Function";
import { DEFAULT_OPEN_AI_API_KEY, SETTINGS_LOCALSTORAGE_KEY } from "src/utils/constants";
import { getItemFromLocalStorageSafely, setItemInLocalStorageSafely } from "./helpers";

export const settingsS = Schema.struct({
  openAiApiKey: pipe(Schema.string, Schema.nonEmpty<string>()),
});

export type Settings = Schema.To<typeof settingsS>;

export type OpenAiAPIKey = Settings["openAiApiKey"];

export const DEFAULT_SETTINGS = {
  openAiApiKey: DEFAULT_OPEN_AI_API_KEY,
} satisfies Settings;

export function isDefaultSettings(settingsObjToCompareWith: Settings): boolean {
  const settingsEqByOpenAiApiKey = pipe(
    Eq.string,
    Eq.contramap((settingsObj: Settings) => settingsObj.openAiApiKey)
  );
  return settingsEqByOpenAiApiKey(DEFAULT_SETTINGS, settingsObjToCompareWith);
}

export function getSettingsFromLocalStorageSafely() {
  return pipe(
    SETTINGS_LOCALSTORAGE_KEY,
    getItemFromLocalStorageSafely(settingsS),
    Effect.catchTags({
      // Handled in this way in case we wish to change how we recover from either of these in the future
      NoSuchElementException: () => Effect.succeed(DEFAULT_SETTINGS),
      ParseError: () => Effect.succeed(DEFAULT_SETTINGS),
    })
  );
}

export const saveSettingsIntoLocalStorageSafely = setItemInLocalStorageSafely(
  SETTINGS_LOCALSTORAGE_KEY
);
