export const StringUtils = {
  capitalizeFirstLetter: (str: string) => {
    if (str && str.length == 0) {
      return "";
    }
    return str[0].toLocaleUpperCase() + str.slice(1).toLocaleLowerCase();
  },
};
