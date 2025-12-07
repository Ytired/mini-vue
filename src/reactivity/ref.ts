import { hasChanged } from "../shared/hasChanged";
import { isObject } from "../shared/isObject";
import { isTrackIng, trackEffect, triggerEffects } from "./effect";
import { reactive, REACTIVE_FLAGS } from "./reactive";

class RefImpl<T = any> {
  _value: T;
  private _rawValue: T;
  _deps: Set<any>;

  readonly [REACTIVE_FLAGS.IS_REF] = true;
  readonly [REACTIVE_FLAGS.IS_READONLY] = false;

  constructor(value: T, isShallow: boolean) {
    this._rawValue = value;
    this._value = toReactive(value);
    this._deps = new Set();
  }

  get value() {
    trackRefValue(this);
    return this._value;
  }

  set value(newValue) {
    if (!hasChanged(this._rawValue, newValue)) return; // 相同值不应该触发

    this._rawValue = newValue;
    this._value = toReactive(newValue);
    triggerEffects(this._deps);
  }
}

function trackRefValue(ref: any) {
  if (isTrackIng()) {
    trackEffect(ref._deps);
  }
}

function toReactive(value: any) {
  return isObject(value) ? reactive(value) : value;
}

function createRef(rawValue: any, isShallow: boolean) {
  return new RefImpl(rawValue, isShallow);
}

export function ref(value: any) {
  return createRef(value, false);
}

export function isRef(ref: any) {
  if (!isObject(ref)) return false;

  return ref[REACTIVE_FLAGS.IS_REF] || false;
}

export function unref(ref: any) {
  if (!isObject(ref)) return ref;

  return isRef(ref) ? ref.value : ref;
}

export function proxyRefs(objectWithRefs: any) {
  return new Proxy(objectWithRefs, {
    get(target, key, receiver) {
      return Reflect.get(unref(target), key, receiver);
    },
    set(target, key, newValue, receiver) {
      if (isRef(target[key]) && !isRef(newValue)) {
        return (target[key].value = newValue);
      } else {
        return Reflect.set(target, key, newValue, receiver);
      }
    },
  });
}
