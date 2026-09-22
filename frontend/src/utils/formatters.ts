export function formatCurrency(
  amount: number,
  symbol: string = "₹",
  locale: string = "en-IN"
): string {
  const absoluteFormatted = Math.abs(amount).toLocaleString(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  if (amount < 0) {
    return `-${symbol}${absoluteFormatted}`;
  }
  return `${symbol}${absoluteFormatted}`;
}

export function formatDate(
  dateString: string,
  format: string = "DD MMM YYYY"
): string {
  if (!dateString) return "";
  const [yearStr, monthStr, dayStr] = dateString.split("-");
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1;
  const day = parseInt(dayStr, 10);

  const date = new Date(year, month, day);

  const day2Digit = String(day).padStart(2, "0");
  const month2Digit = String(month + 1).padStart(2, "0");
  const monthShort = date.toLocaleString("en-US", { month: "short" });
  const monthLong = date.toLocaleString("en-US", { month: "long" });

  switch (format) {
    case "YYYY-MM-DD":
      return `${year}-${month2Digit}-${day2Digit}`;
    case "DD/MM/YYYY":
      return `${day2Digit}/${month2Digit}/${year}`;
    case "MM/DD/YYYY":
      return `${month2Digit}/${day2Digit}/${year}`;
    case "DD MMM YYYY":
    default:
      return `${day2Digit} ${monthShort} ${year}`;
  }
}

export function getMonthName(monthNumber: number): string {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return months[monthNumber - 1] || "";
}

export function getShortMonthName(monthNumber: number): string {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  return months[monthNumber - 1] || "";
}

export function calculatePercentage(spent: number, limit: number): number {
  if (limit <= 0) return 0;
  return Math.round((spent / limit) * 100);
}
