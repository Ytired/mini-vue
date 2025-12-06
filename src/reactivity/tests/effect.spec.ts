import { describe, expect, it, test, vitest } from "vitest";
import { effect, stop } from "../effect";
import { reactive } from "../reactive";

describe("effect", () => {
  it("happy path", () => {
    const user = reactive({
      age: 10,
    });

    let nextAge;
    effect(() => {
      nextAge = user.age + 1;
    });
    expect(nextAge).toBe(11);

    // update
    user.age++;
    expect(nextAge).toBe(12);
  });

  it("测试effect的返回值和手动调用", () => {
    let foo = 10;

    const runner = effect(() => {
      foo++;

      return "foo";
    });

    expect(foo).toBe(11);
    const r = runner();
    expect(foo).toBe(12);
    expect(r).toBe("foo");
  });

  it("scheduler", () => {
    let dummy;
    let run: any;

    const scheduler = vitest.fn(() => {
      run = runner;
    });

    const obj = reactive({
      foo: 1,
    });

    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      { scheduler }
    );

    // 第一次收集依赖的时候确保scheduler不会被执行
    expect(scheduler).not.toHaveBeenCalled();
    expect(dummy).toBe(1);

    obj.foo++;

    // 响应式触发后保证scheduler被执行一次
    expect(scheduler).toHaveBeenCalledTimes(1);
    expect(dummy).toBe(1);

    // 手动触发effect后确保依赖被执行
    run();
    expect(dummy).toBe(2);
    // run()
    // expect(dummy).toBe(3)
  });

  it("stop", () => {
    let dummy;
    const obj = reactive({ prop: 1 });
    const runner = effect(() => {
      dummy = obj.prop;
    });
    obj.prop = 2;
    expect(dummy).toBe(2);
    stop(runner);
    obj.prop = 3;
    expect(dummy).toBe(2);

    // 停止效果应该仍然可以手动调用
    runner();
    expect(dummy).toBe(3);
  });

  it("onStop", () => {
    const onStop = vitest.fn()
    const runner = effect(() => {}, {
      onStop,
    })

    stop(runner)
    expect(onStop).toHaveBeenCalled()
  });
});
