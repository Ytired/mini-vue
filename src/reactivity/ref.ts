import { hasChanged } from "../shared/hasChanged";
import { isTrackIng, trackEffect, triggerEffects } from "./effect";
import { REACTIVE_FLAGS } from "./reactive";

class RefImpl<T = any> {
  _value: T;
  private _rawValue: T;
  _deps: Set<any>;

  readonly [REACTIVE_FLAGS.IS_REF] = true;
  readonly [REACTIVE_FLAGS.IS_READONLY] = false;

  constructor(value: T, isShallow: boolean) {
    this._value = value;
    this._rawValue = value;
    this._deps = new Set();
  }

  get value() {
    trackRefValue(this);
    return this._value;
  }

  set value(newValue) {
    if (!hasChanged(this._value, newValue)) return; // 相同值不应该触发

    this._value = newValue;
    this._rawValue = newValue;
    triggerEffects(this._deps);
  }
}

function trackRefValue(ref: any) {
  if (isTrackIng()) {
    trackEffect(ref._deps);
  }
}

function createRef(rawValue: any, isShallow: boolean) {
  return new RefImpl(rawValue, isShallow);
}

export function ref(value: any) {
  return createRef(value, false);
}
