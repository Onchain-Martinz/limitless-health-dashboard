export function fmtNumber(value: unknown, fallback = "N/A") {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value.toLocaleString();
  }
  if (typeof value === "string") {
    const n = Number(value);
    if (Number.isFinite(n)) return n.toLocaleString();
  }
  return fallback;
}
