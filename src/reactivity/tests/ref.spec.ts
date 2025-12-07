import { describe, expect, test, vitest } from "vitest";
import { effect } from "../effect";
import { ref } from "../ref";

describe("ref", () => {
  test("happy path", () => {
    const foo = ref(1);
    expect(foo.value).toBe(1);
    foo.value++;
    expect(foo.value).toBe(2);
  });

  test("ref in effect", () => {
    const foo = ref(1);
    let dummy;
    const fn = vitest.fn(() => {
      dummy = foo.value;
    });
    effect(fn);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(dummy).toBe(1);
    foo.value++;
    expect(fn).toHaveBeenCalledTimes(2);
    expect(dummy).toBe(2);

    // 相同值不应触发
    foo.value = 2;
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
