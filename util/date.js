export function getFormattedDate(date) {
  if (!date) {
    return 'Invalid date';
  }
  const parsedDate = new Date(date);
  if (isNaN(parsedDate)) {
    return 'Invalid date';
  }
  const offset = parsedDate.getTimezoneOffset();
  const adjustedDate = new Date(parsedDate.getTime() - offset * 60 * 1000);
  return adjustedDate.toISOString().split('T')[0];
}

export function getDateMinusDays(date, days) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - days);
}
 