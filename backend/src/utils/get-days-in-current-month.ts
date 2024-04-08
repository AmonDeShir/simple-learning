
export function getDayOfNextMonth(month: number, day?: number): Date {
  let year = new Date().getFullYear();
  
  if (month >= 12) {
    month -= 12;
    year += 1;
  }

  return new Date(
    year,
    new Date().getMonth() + month,
    day ? day : new Date().getDate() + 1
  )
}

export function getDaysInNextMonth(month: number) {
  let year = new Date().getFullYear();
  
  if (month >= 12) {
    month -= 12;
    year += 1;
  }

  return getDaysInMonth(new Date().getMonth() + 1 + month, year);
}

export function getDaysInCurrentMonth() {
  const date = new Date();

  return getDaysInMonth(date.getMonth() + 1, date.getFullYear());
}

export function getDaysInMonth(month: number, year: number) {

  return new Date(
    year,
    month,
    0
  ).getDate();
}
