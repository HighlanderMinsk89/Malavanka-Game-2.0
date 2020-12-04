export const nameShortener = (name) => {
  return name.length > 15 ? name.substring(0, 16) + '..' : name
}
