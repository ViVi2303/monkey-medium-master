const toSlug = (string) => {
  if (!string) {
    return "";
  }

  const regex = /[\/\s]+/;
  let slug = string.split(regex);
  slug = slug.join("-").toLowerCase();
  return slug;
};

export default toSlug;
