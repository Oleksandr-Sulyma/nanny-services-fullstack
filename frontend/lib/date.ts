export function getAgeFromBirthday(birthday?: string): number | null {
  if (!birthday) {
    return null;
  }

  const today = new Date();
  const birthDate = new Date(birthday);

  if (isNaN(birthDate.getTime())) {
    return null;
  }

  let age = today.getFullYear() - birthDate.getFullYear();

  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}
