export const isString = (value: string | boolean): value is string => {
  return typeof value === "string";
};
