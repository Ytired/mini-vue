import { mutableHandler, readonlyHandler } from "./baseHandler";

export const REACTIVE_FLAGS = {
  IS_REACTIVE: "is_reactive",
  IS_READONLY: "is_readonly"
}

export function reactive(raw: any) {
  const proxy = createActiveProxy(raw, mutableHandler);

  return proxy;
}

export function readonly(raw: any) {
  const proxy = createActiveProxy(raw, readonlyHandler);

  return proxy;
}

export function isReactive(raw: any) {
  return !!raw[REACTIVE_FLAGS.IS_REACTIVE]
}

export function isReadonly(raw: any) {
  return !!raw[REACTIVE_FLAGS.IS_READONLY]
}

function createActiveProxy(raw: any, handler: any) {
  return new Proxy(raw, handler);
}
