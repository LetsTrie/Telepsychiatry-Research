exports.pagination = (page, LIMIT, totalItems, baseUrl) => {
  return {
    URL: baseUrl,
    currentPage: page,
    hasNextPage: page * LIMIT < totalItems,
    hasPreviousPage: page > 1,
    nextPage: page + 1,
    previousPage: page - 1,
    lastPage: Math.ceil(totalItems / LIMIT)
  };
};

exports.makeSmallParagraphFromHTML = (data, parameter) => {
  let mData = [];
  for (let i = 0; i < data.length; i++) {
    let flag = false;
    let cnt = 0;
    let str = '';
    let BrifDes = data[i][`${parameter}`];
    for (let j = 0; j < BrifDes.length; j++) {
      let x = BrifDes[j];
      if (x === '<') {
        flag = true;
        continue;
      }
      if (x === '>') {
        flag = false;
        continue;
      }
      if (flag) continue;
      cnt++;
      if (cnt === 300) break;
      str += x;
    }
    let xx = data[i];
    xx.BriefDesciption = str;
    mData.push(xx);
  }
  return mData;
};
