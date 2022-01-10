function normalizeArr(arr) {
  const res = {};

  arr = JSON.parse(JSON.stringify(arr));

  arr.forEach((item) => {
    res[item.id] = item;
  });

  return res;
}

module.exports = normalizeArr;
