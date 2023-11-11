/* eslint-disable @typescript-eslint/no-unused-vars */
import { Equal, Expect } from "../internals/helpers";
import { Strings } from "../internals/strings";

test("Split", () => {
  type result1 = Strings.Split<"a/b/c/d", "/">;
  type test1 = Expect<Equal<result1, ["a", "b", "c", "d"]>>;

  type result2 = Strings.Split<"another_string_to_be_split", "_">;
  type test2 = Expect<Equal<result2, ["another", "string", "to", "be", "split"]>>;

  type result3 = Strings.Split<"", "_">;
  type test3 = Expect<Equal<result3, [""]>>;
});
