import { Dep } from "./dep";
import { extend } from "../shared/extend";

type effect = () => void;

let activeEffect: ReactiveEffct;
let shouldTrack = false;

export class ReactiveEffct {
  deps: Array<any> = []; //同一个effect内会触发多个track
  scheduler?: () => void;
  onStop?: () => void;
  private _fn: any;
  private _active = true;

  constructor(fn: effect) {
    this._fn = fn;
  }

  run() {
    if (!this._active) {
      //如果stop了后直接返回
      return this._fn();
    }

    activeEffect = this;
    shouldTrack = true;

    const res = this._fn();

    shouldTrack = false;
    return res;
  }

  // 停止自动收集依赖
  stop() {
    if (this._active) {
      cleanupEffect(this);
      this._active = false;
    }

    if (this.onStop && typeof this.onStop === "function") this.onStop();
  }
}

function cleanupEffect(effect: any) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect);
  });
}

export function effect(fn: effect, options: any = {}) {
  const _effect = new ReactiveEffct(fn);
  extend(_effect, options);
  _effect.run();

  const runner: any = _effect.run.bind(_effect);
  runner.effect = _effect; // 将effect实例挂载到runner上

  // 将当前effect函数返回出去，供外部手动调用
  return runner;
}

// 收集依赖
const targetMap = new Map();
export function track(target: any, key: any) {
  if (!isTrackIng()) return;
  // target -> key -> effects

  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }

  trackEffect(dep);
}

export function trackEffect(dep: any) {
  if (dep.has(activeEffect)) return;

  dep.add(activeEffect);
  activeEffect.deps.push(dep); // 同一个effect函数中触发多个响应式依赖
}

export function isTrackIng() {
  return activeEffect && shouldTrack;
}

// 触发依赖
export function trigger(target: any, key: any) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return false;

  const dep = depsMap.get(key);
  if (!dep) return false;

  triggerEffects(dep);
}

export function triggerEffects(dep: any) {
  dep.forEach((effect: ReactiveEffct) => {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  });
}

// 停止触发依赖
export function stop(runner: any) {
  var _effect = runner.effect;
  _effect.stop();
}
