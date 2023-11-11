export namespace Tuples {
  export type GetLast<T> = T extends [...infer _, infer Last] ? Last : never;
}
