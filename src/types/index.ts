export type AnyObject = object;

export type EmptyObject = Record<string, never>;

export type ToMutable<Obj extends object> = {
  -readonly [Key in keyof Obj]: Obj[Key];
};
