export namespace Object {
  export type Mutable<Obj extends object> = {
    -readonly [Key in keyof Obj]: Obj[Key];
  };
}
