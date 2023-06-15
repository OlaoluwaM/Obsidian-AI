export type EmptyObject = Record<string, never>;

export type AnyObject = object;

export type Equal<a, b> = (<T>() => T extends a ? 1 : 2) extends <T>() => T extends b
  ? 1
  : 2
  ? true
  : false;

export type IsNever<T> = [T] extends [never] ? true : false;

export type Expect<a extends true> = a;
