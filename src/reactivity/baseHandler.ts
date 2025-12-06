import { isObject } from "../shared/isObject";
import { track, trigger } from "./effect";
import { reactive, readonly, REACTIVE_FLAGS } from "./reactive";

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);

function createGetter(isReadonly = false) {
  return function get(target: any, key: string | symbol, receiver: any) {
    if (key === REACTIVE_FLAGS.IS_REACTIVE) {
      return !isReadonly;
    }

    if (key === REACTIVE_FLAGS.IS_READONLY) {
      return isReadonly;
    }

    const value = Reflect.get(target, key, receiver);

    if (!isReadonly) {
      track(target, key);
    }

    // 嵌套对象需要递归转换为响应式/只读
    if (isObject(value)) {
      return isReadonly ? readonly(value) : reactive(value);
    }

    return value;
  };
}

function createSetter() {
  return function set(
    target: any,
    key: string | symbol,
    newValue: any,
    receiver: any
  ) {
    const res = Reflect.set(target, key, newValue, receiver);
    trigger(target, key);
    return res;
  };
}

export const mutableHandler = {
  get,
  set,
};

export const readonlyHandler = {
  get: readonlyGet,
  set() {
    return false
  },
};
