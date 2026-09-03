function toMonthValue(date: Date): string {

  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, '0');

  return `${year}-${month}`;

}


export function getCurrentMonth(): string {

  return toMonthValue(new Date());

}


export function getRecentMonths(
  count: number = 12
): string[] {

  const today = new Date();

  return Array.from(
    { length: count },
    (_, index) =>
      toMonthValue(
        new Date(
          today.getFullYear(),
          today.getMonth() - index,
          1
        )
      )
  );

}


export function formatMonth(
  month: string,
  locale: string
): string {

  const [year, monthNumber] =
    month.split('-');

  const date = new Date(
    Number(year),
    Number(monthNumber) - 1,
    1
  );

  return new Intl.DateTimeFormat(
    locale,
    {
      month: 'long',
      year: 'numeric'
    }
  ).format(date);

}
