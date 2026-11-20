
export function parseMoneyValue(value) {
  if (typeof value === "number") {
    return value;
  }

  const text = String(value)
    .trim()
    .replace(/[R$\s]/g, "");

  const formatted = text.includes(",")
    ? text.replace(/\./g, "").replace(",", ".")
    : text;

  return Number(formatted);
}
