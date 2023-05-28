/* eslint-disable import/prefer-default-export */
import { Notice } from "obsidian";

export function sendNotificationStr(message: string, duration?: number) {
  return new Notice(message, duration);
}
