export type AnyObject = object;

export type EmptyObject = Record<string, never>;

export type Mutable<Obj extends object> = {
  -readonly [Key in keyof Obj]: Obj[Key];
};
