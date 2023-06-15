import * as Effect from "@effect/io/Effect";

import { StrictMode } from "react";
import { Root as ReactRoot, createRoot } from "react-dom/client";
import { unmountComponentAtNode } from "react-dom";
import {
  App,
  Modal,
  Plugin,
  Editor,
  Setting,
  MarkdownView,
  PluginSettingTab,
} from "obsidian";

import type { Object } from "@typelevel/index";

import { roundDecimal } from "@utils/index";
import { RootElemAttrs } from "@core/index";
import { makeRenderResourcesForAskAiInput } from "@features/ask-ai";
import { getPositionOfCurrentActiveLine, sendNotificationStr } from "@lib/obsidian";
import {
  Settings,
  isDefaultSettings,
  getSettingsFromLocalStorageSafely,
  saveSettingsIntoLocalStorageSafely,
} from "@settings/index";
import { LazyMotion, domMax } from "framer-motion";

export default class ObsidianAI extends Plugin {
  settings: Object.Mutable<Settings>;

  uiRootElem: UIRootElem;

  async onload() {
    this.loadSettings();

    // This adds a settings tab so the user can configure various aspects of the plugin
    this.addSettingTab(new SettingsTab(this.app, this));

    if (isDefaultSettings(this.settings)) {
      sendNotificationStr(
        "Hi! Thanks for installing Obsidian AI. To unleash the power of AI onto your digital brain/garden, please configure your settings. Thanks and enjoy!",
        0
      );
      return;
    }

    // This creates an icon in the left ribbon.
    const ribbonIconEl = this.addRibbonIcon(
      "brain-circuit",
      "Obsidian AI",
      (evt: MouseEvent) => {
        // Called when the user clicks the icon.
        sendNotificationStr("This is a notice!");
      }
    );

    // Perform additional things with the ribbon
    ribbonIconEl.addClass("my-plugin-ribbon-class");

    this.addCommand({
      id: "ask-ai",
      name: "Ask AI",
      editorCallback: (e, m) => {
        if (this.uiRootElem?.isMounted) return;

        const { left, bottom } = Effect.runSync(getPositionOfCurrentActiveLine());
        const DIST_BETWEEN_ACTIVE_LINE_AND_ROOT_ELEM = 5;

        const roundToThreeDecimalPlaces = roundDecimal(3);

        const rootElemAttrs: Partial<RootElemAttrs> = {
          style: `position: absolute; left: ${roundToThreeDecimalPlaces(left)}px; top: ${
            roundToThreeDecimalPlaces(bottom) + DIST_BETWEEN_ACTIVE_LINE_AND_ROOT_ELEM
          }px`,
          id: "ask-ai-input-root-elem",
        };

        const { rootElem, UI } = Effect.runSync(
          makeRenderResourcesForAskAiInput(rootElemAttrs)
        );

        this.registerDomEvent(document, "click", () => this.uiRootElem.unmount(), {
          once: true,
        });

        this.registerDomEvent(document, "root:unmount", () => this.uiRootElem.unmount(), {
          once: true,
        });

        const uiRoot = createRoot(rootElem);
        this.uiRootElem = new UIRootElem(uiRoot, rootElem);

        uiRoot.render(
          <StrictMode>
            <LazyMotion features={domMax}>
              <UI settings={this.settings} />
            </LazyMotion>
          </StrictMode>
        );
      },
    });

    // This adds a status bar item to the bottom of the app. Does not work on mobile apps.
    // const statusBarItemEl = this.addStatusBarItem();
    // statusBarItemEl.setText("Status Bar Text");

    // This adds a simple command that can be triggered anywhere
    this.addCommand({
      id: "open-sample-modal-simple",
      name: "Open sample modal (simple)",
      callback: () => {
        new SampleModal(this.app).open();
      },
    });

    // This adds an editor command that can perform some operation on the current editor instance
    this.addCommand({
      id: "sample-editor-command",
      name: "Sample editor command",
      editorCallback: (editor: Editor, view: MarkdownView) => {
        console.log(editor.getSelection());
        editor.replaceSelection("Sample Editor Command");
      },
    });

    // This adds a complex command that can check whether the current state of the app allows execution of the command
    this.addCommand({
      id: "open-sample-modal-complex",
      name: "Open sample modal (complex)",
      checkCallback: (checking: boolean) => {
        // Conditions to check
        const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (markdownView) {
          // If checking is true, we're simply "checking" if the command can be run.
          // If checking is false, then we want to actually perform the operation.
          if (!checking) {
            new SampleModal(this.app).open();
          }

          // This command will only show up in Command Palette when the check function returns true
          return true;
        }
      },
    });

    // If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
    // Using this function will automatically remove the event listener when this plugin is disabled.
    this.registerDomEvent(document, "click", (evt: MouseEvent) => {
      console.log("click", evt);
    });

    // When registering intervals, this function will automatically clear the interval when the plugin is disabled.
    this.registerInterval(
      window.setInterval(() => console.log("setInterval"), 5 * 60 * 1000)
    );
  }

  onunload() {
    this.uiRootElem.unmount();
  }

  loadSettings() {
    this.settings = Effect.runSync(getSettingsFromLocalStorageSafely());
  }

  async saveSettings() {
    Effect.runSync(saveSettingsIntoLocalStorageSafely(this.settings));

    await this.saveData({
      message: "Settings are saved in local storage",
    });
  }
}

class UIRootElem {
  #reactRootElem: ReactRoot;

  #DOMRootElem: HTMLElement;

  isMounted = true;

  constructor(reactRootElem: ReactRoot, domRootElem: HTMLElement) {
    this.#reactRootElem = reactRootElem;
    this.#DOMRootElem = domRootElem;
  }

  unmount() {
    if (!this.isMounted) return;
    this.#reactRootElem.unmount();
    this.#DOMRootElem.remove();
    this.isMounted = false;
  }
}

class SampleModal extends Modal {
  onOpen() {
    const { contentEl } = this;
    contentEl.setText("Woah!");
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}

class SettingsTab extends PluginSettingTab {
  plugin: ObsidianAI;

  constructor(app: App, plugin: ObsidianAI) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();
    containerEl.createEl("h2", { text: "AI Settings" });

    new Setting(containerEl)
      .setName("OpenAI API Key")
      .setDesc("Your API key to access the OpenAI models")
      .addText(text =>
        text
          .setPlaceholder("")
          .setValue(this.plugin.settings.openAiApiKey)
          .onChange(async value => {
            this.plugin.settings.openAiApiKey = value;
            await this.plugin.saveSettings();
          })
      );
  }
}
