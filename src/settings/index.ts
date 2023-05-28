import * as Eq from "@effect/data/typeclass/Equivalence";
import * as Effect from "@effect/io/Effect";
import * as Schema from "@effect/schema/Schema";

import { pipe } from "@effect/data/Function";
import { DEFAULT_OPEN_AI_API_KEY, SETTINGS_LOCALSTORAGE_KEY } from "src/utils/constants";
import { getItemFromLocalStorageSafely, setItemInLocalStorageSafely } from "./helpers";

export const settingsS = Schema.struct({
  openAiApiKey: pipe(Schema.string, Schema.nonEmpty<string>()),
  useLocalStorage: Schema.boolean,
});

export type Settings = Schema.To<typeof settingsS>;

export const DEFAULT_SETTINGS = {
  openAiApiKey: DEFAULT_OPEN_AI_API_KEY,
  useLocalStorage: true,
} satisfies Settings;

export function isDefaultSettings(settingsObjToCompareWith: Settings): boolean {
  const settingsEqByOpenAiApiKey = pipe(
    Eq.string,
    Eq.contramap((settingsObj: Settings) => settingsObj.openAiApiKey)
  );
  return settingsEqByOpenAiApiKey(DEFAULT_SETTINGS, settingsObjToCompareWith);
}

export function loadSettingsBasedOnUserPrefs() {
  /*
		If this.loadData returns the default settings and there are no settings in local storage, carry and do nothing else
		If there are settings in local storage and useLocalStorage is set to true, use the settings stored in local storage instead and ensure that any modifications made to the settings are also stored in local storage.

		However, if useLocalStorage were to be set to false, then follow the default behavior


	*/
}

class SettingsSaveError {
  readonly _tag = "SettingsSaveError";

  constructor(readonly error: string) {}
}

type ObsidianSaveSettingsFn = (settingsObj: Settings) => Promise<void>;

export function saveSettingsBasedOnUserPrefs(saveSettingsFn: ObsidianSaveSettingsFn) {
  return (settingsToBeSaved: Settings) =>
    Effect.tryCatchPromise(
      async () => {
        Effect.runSync(
          setItemInLocalStorageSafely(settingsToBeSaved)(SETTINGS_LOCALSTORAGE_KEY)
        );
        // await saveSettingsFn(settingsToBeSaved);
      },
      reason => new SettingsSaveError(`Error Occurred saving settings: ${reason}`)
    );
}

export const getSettingsFromLocalStorageSafely = getItemFromLocalStorageSafely(settingsS);
