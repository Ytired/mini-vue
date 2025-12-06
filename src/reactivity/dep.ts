type runFc = () => void;

export const globalEffects = new WeakMap();

export class Dep {
  private effects: Array<any>

  constructor(fn : runFc) {
    this.effects = []

    this.effects.push(fn)
  }
  public add(fn : runFc) {
    this.effects.push(fn)
  }
  public run() {
    this.effects.forEach((value, key) => {
      value()
    })
  }
}