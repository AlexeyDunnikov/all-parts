module.exports = (arr, key) => {
  const res = {};

  arr.forEach((item) => {
    res[item[key]] = item;
  });

  return res;
}
