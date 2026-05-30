export const FIFTEEN_MINUTES = 15 * 60 * 1000;
export const ONE_DAY = 24 * 60 * 60 * 1000;

export const getAllowedBirthDate = (age) => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - age);
  return date;
};