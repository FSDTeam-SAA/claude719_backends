export const calculateAge = (dob: string) => {
  const birthday = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthday.getFullYear();
  const monthDiff = today.getMonth() - birthday.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthday.getDate())
  ) {
    age--;
  }

//   console.log(age);

  return age;
};
