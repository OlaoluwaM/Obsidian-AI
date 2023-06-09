/* eslint-disable import/prefer-default-export */

export function smartStringify(val: unknown): string {
  if (typeof val === "string") return val;
  return JSON.stringify(val);
}

export function roundDecimal(decimalPlaces: number) {
  return (n: number) => parseFloat(n.toFixed(decimalPlaces));
}
