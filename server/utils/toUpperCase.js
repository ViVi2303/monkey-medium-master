const toUpperCase = (string) => {
  if (!string) {
    return "";
  }

  return string
    .split(" ")
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
};

export default toUpperCase;
