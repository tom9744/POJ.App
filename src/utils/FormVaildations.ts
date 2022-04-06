export const DATE_PATTERN = /^(19|20)\d{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[0-1])$/;

export const isNotEmpty = (value: string) => {
  return value.trim().length > 0 || "값이 비었습니다.";
};

export const isValidDate = (value: string) => {
  if (DATE_PATTERN.test(value)) {
    const currentDate = new Date().getTime();
    const enteredDate = new Date(value).getTime();
    return currentDate > enteredDate || "유효하지 않은 날짜입니다.";
  } else {
    return "유효하지 않은 날짜 형식입니다.";
  }
};
