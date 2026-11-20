
export const MONTH_NAMES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

function isWithinAllowedRange(date) {
  const today = new Date();
  today.setHours(12, 0, 0, 0);

  const maxDate = new Date(
    today.getFullYear() + 1,
    today.getMonth(),
    today.getDate(),
    12
  );

  return date >= new Date(1900, 0, 1, 12) && date <= maxDate;
}

export function formatDateInput(value) {
  if (!value) return "";

  const text = String(value).trim();
  const isoDate = text.match(/^(\d{4})-(\d{2})-(\d{2})/);

  if (isoDate) {
    return `${isoDate[3]}/${isoDate[2]}/${isoDate[1]}`;
  }

  const digits = text.replace(/\D/g, "").slice(0, 8);

  if (digits.length <= 2) {
    return digits;
  }

  if (digits.length <= 4) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }

  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

export function isValidDate(value) {
  const match = String(value || "").match(
    /^(\d{2})\/(\d{2})\/(\d{4})$/
  );

  if (!match) return false;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);

  if (year < 1900 || month < 1 || month > 12) {
    return false;
  }

  const date = new Date(year, month - 1, day, 12);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day &&
    isWithinAllowedRange(date)
  );
}

export function parseTransactionDate(value) {
  if (!value) return null;

  const text = String(value).trim();

  const brazilianDate = text.match(
    /^(\d{2})\/(\d{2})\/(\d{4})$/
  );

  if (brazilianDate) {
    const day = Number(brazilianDate[1]);
    const month = Number(brazilianDate[2]);
    const year = Number(brazilianDate[3]);

    if (!isValidDate(text)) return null;

    return new Date(year, month - 1, day, 12);
  }

  const isoDate = text.match(/^(\d{4})-(\d{2})-(\d{2})/);

  if (isoDate) {
    const year = Number(isoDate[1]);
    const month = Number(isoDate[2]);
    const day = Number(isoDate[3]);

    const date = new Date(year, month - 1, day, 12);

    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day ||
      !isWithinAllowedRange(date)
    ) {
      return null;
    }

    return date;
  }

  return null;
}

export function getTransactionTimestamp(value) {
  const date = parseTransactionDate(value);

  return date ? date.getTime() : 0;
}

export function sortTransactionsByDate(transactions) {
  return [...transactions].sort(
    (a, b) =>
      getTransactionTimestamp(b.date) -
      getTransactionTimestamp(a.date)
  );
}
