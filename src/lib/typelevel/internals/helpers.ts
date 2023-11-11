export type EmptyObject = Record<string, never>;

export type AnyObject = object;

// From https://github.com/gvergnaud/hotscript/blob/main/src/internals/helpers.ts
export type Equal<a, b> = (<T>() => T extends a ? 1 : 2) extends <T>() => T extends b
  ? 1
  : 2
  ? true
  : false;

export type IsNever<T> = [T] extends [never] ? true : false;

// From https://github.com/gvergnaud/hotscript/blob/main/src/internals/helpers.ts
export type Expect<a extends true> = a;
