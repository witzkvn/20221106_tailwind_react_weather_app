export const formatDateToHours = (date) => {
  return date.toTimeString().split(" ")[0];
};
