export const hasChanged = (value: any, newValue: any) => {
  return Object.is(value, newValue);
}