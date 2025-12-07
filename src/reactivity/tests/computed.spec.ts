import { describe, expect, it, vi } from "vitest";
import { reactive } from "../reactive";
import { ref } from "../ref";
import { computed } from "../computed";

describe("computed", () => {
  it("should return updated value", () => {
    const value = reactive({});
    const cValue = computed(() => value.foo);
    expect(cValue.value).toBe(undefined);
    value.foo = 1;
    expect(cValue.value).toBe(1);
  });

  it("pass oldValue to computed getter", () => {
    const count = ref(0);
    const oldValue = ref();
    const curValue = computed((pre) => {
      oldValue.value = pre;
      return count.value;
    });
    expect(curValue.value).toBe(0);
    expect(oldValue.value).toBe(undefined);
    count.value++;
    expect(curValue.value).toBe(1);
    expect(oldValue.value).toBe(0);
  });

  it("should compute lazily", () => {
    const value = reactive({});
    const getter = vi.fn(() => value.foo);
    const cValue = computed(getter);

    // lazy
    expect(getter).not.toHaveBeenCalled();

    expect(cValue.value).toBe(undefined);
    expect(getter).toHaveBeenCalledTimes(1);

    // 不应该再计算
    cValue.value;
    expect(getter).toHaveBeenCalledTimes(1);

    // 不应在需要时才计算
    value.foo = 1;
    expect(getter).toHaveBeenCalledTimes(1);

    // 现在它应该计算
    expect(cValue.value).toBe(1);
    expect(getter).toHaveBeenCalledTimes(2);

    // 不应该再计算
    cValue.value;
    expect(getter).toHaveBeenCalledTimes(2);
  });
});
