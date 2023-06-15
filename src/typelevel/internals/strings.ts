export namespace Strings {
  export type Split<
    S extends string,
    Sep extends string
  > = S extends `${infer First}${Sep}${infer Rest}` ? [First, ...Split<Rest, Sep>] : [S];
}
