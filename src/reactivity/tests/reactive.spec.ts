import { describe, expect, test } from "vitest";
import { isProxy, isReactive, reactive } from "../reactive";

describe("reactive", () => {
  test("happy path", () => {
    const original = { age: 18 };
    const proxyObj = reactive(original);

    expect(proxyObj).not.toBe(original);

    proxyObj.age++;
    expect(proxyObj.age).toBe(19);
    expect(isReactive(proxyObj)).toBe(true);
    expect(isProxy(proxyObj)).toBe(true)
  });

  test("nested reactives", () => {
    const original = {
      nested: {
        foo: 1,
      },
      array: [{ bar: 2 }],
    };
    const observed = reactive(original);
    expect(isReactive(observed.nested)).toBe(true);
    expect(isReactive(observed.array)).toBe(true);
    expect(isReactive(observed.array[0])).toBe(true);
  });
});
