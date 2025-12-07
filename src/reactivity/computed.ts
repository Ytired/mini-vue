import { ReactiveEffct } from "./effect";
import type { RefImpl } from "./ref";

type TGetter = (...args: any[]) => void;

class ComputedRefImpl {
  private _getter: TGetter;
  private _value: any;
  private _deps: Set<any>;
  private _dirty: boolean = true;
  private _effect: ReactiveEffct;

  constructor(getter: TGetter) {
    this._getter = getter;
    this._effect = new ReactiveEffct(getter);
    // 有scheduler的时候就不会自动出发依赖了
    this._effect.scheduler = () => {
      if (!this._dirty) {
        this._dirty = true;
      }
    }
    this._deps = new Set();
  }

  get value() {
    if (this._dirty) {
      this._dirty = false;
      this._value = this._effect.run(this._value);
    }
    return this._value;
  }
}

export function computed(getter: TGetter): ComputedRefImpl {
  const computedRefImpl = new ComputedRefImpl(getter);

  return computedRefImpl;
}
