import { describe, expect, test } from "vitest";
import { isProxy, isReactive, isReadonly, readonly } from "../reactive";

describe("readonly", () => {
  test("happy path", () => {
    const original = { age: 18 };
    const proxyObj = readonly(original);

    expect(proxyObj).not.toBe(original);

    try {
      proxyObj.age++;
    } catch (error) {}
    expect(proxyObj.age).toBe(18);
    expect(isReadonly(proxyObj)).toBe(true);
    expect(isProxy(proxyObj)).toBe(true)
  });

  test("巢状 readonly", () => {
    const original = {
      nested: {
        foo: 1,
      },
      array: [{ bar: 2 }],
    };
    const observed = readonly(original);
    expect(isReadonly(observed.nested)).toBe(true);
    expect(isReadonly(observed.array)).toBe(true);
    expect(isReadonly(observed.array[0])).toBe(true);
  });
});
