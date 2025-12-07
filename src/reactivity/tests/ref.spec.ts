import { describe, expect, it, test, vitest } from "vitest";
import { effect } from "../effect";
import { isRef, ref, unref } from "../ref";

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

  it("should make nested properties reactive", () => {
    const a = ref({
      count: 1,
    });
    let dummy;
    effect(() => {
      dummy = a.value.count;
    });
    expect(dummy).toBe(1);
    a.value.count = 2;
    expect(dummy).toBe(2);
  });

  test("isRef", () => {
    expect(isRef(ref(1))).toBe(true);
    // expect(isRef(computed(() => 1))).toBe(true);

    expect(isRef(0)).toBe(false);
    expect(isRef(1)).toBe(false);
    // 看起来像ref的对象不一定是ref
    expect(isRef({ value: 0 })).toBe(false);
  });

  test("unref", () => {
    expect(unref(1)).toBe(1);
    expect(unref(ref(1))).toBe(1);
  });

    it('should NOT unwrap ref types nested inside arrays', () => {
    const arr = ref([1, ref(3)]).value
    expect(isRef(arr[0])).toBe(false)
    expect(isRef(arr[1])).toBe(true)
    expect(arr[1].value).toBe(3)
  })
});
