import { describe, expect, test } from "vitest";
import { isReadonly, shallowReadonly } from "../reactive";

describe("shallowReadonly", () => {
  test("should not make non-reactive properties reactive", () => {
    const props = shallowReadonly({ n: { foo: 1 } });
    expect(isReadonly(props.n)).toBe(false);
    expect(isReadonly(props)).toBe(true);

    props.n.foo++;
    expect( props.n.foo).toBe(2);
  });
});
