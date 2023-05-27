import * as Schema from "@effect/schema/Schema";

import { pipe } from "@effect/data/Function";
import { ToMutable } from "src/types";
import { DEFAULT_OPEN_AI_API_KEY, SETTINGS_LOCALSTORAGE_KEY } from "src/utils/constants";
import { getItemFromLocalStorageSafely } from "./helpers";

export const SettingsS = Schema.struct({
  openAiApiKey: pipe(Schema.string, Schema.nonEmpty<string>()),
  useLocalStorage: Schema.boolean,
});

export type Settings = ToMutable<Schema.To<typeof SettingsS>>;

export const DEFAULT_SETTINGS = {
  openAiApiKey: DEFAULT_OPEN_AI_API_KEY,
  useLocalStorage: true,
} satisfies Settings;

export function disableOpenAiApiKeySettingInput() {
  const f = pipe(SETTINGS_LOCALSTORAGE_KEY, getSettingsFromLocalStorageSafely);
}

export const getSettingsFromLocalStorageSafely = getItemFromLocalStorageSafely(SettingsS);
