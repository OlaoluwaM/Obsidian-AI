/* eslint-disable @typescript-eslint/no-empty-interface */
interface CustomEventMap {
  "root:unmount": CustomEvent;
}

interface WindowEventMap extends CustomEventMap {}

interface DocumentEventMap extends CustomEventMap {}

interface Document {
  // adds definition to Document, but you can do the same with HTMLElement
  addEventListener<K extends keyof CustomEventMap>(
    type: K,
    listener: (this: Document, ev: CustomEventMap[K]) => void
  ): void;
  dispatchEvent<K extends keyof CustomEventMap>(ev: CustomEventMap[K]): void;
}
