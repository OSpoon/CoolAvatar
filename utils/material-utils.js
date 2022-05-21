const getCurrentPointXiangxian = (data, x = 0, y = 0) => {
  const {
    festivalCenterX = 0,
      festivalCenterY = 0,
  } = data;
  if (x >= festivalCenterX && y <= festivalCenterY) {
    return 1;
  }
  if (x <= festivalCenterX && y <= festivalCenterY) {
    return 2;
  }
  if (x <= festivalCenterX && y >= festivalCenterY) {
    return 3;
  }
  if (x >= festivalCenterX && y >= festivalCenterY) {
    return 4;
  }
}

const switchPoint = (data, x = 0, y = 0) => {
  const xx = getCurrentPointXiangxian(data, x, y);
  const {
    festivalCenterX,
    festivalCenterY,
  } = data;
  switch (xx) {
    case 1:
      return {
        x: x - festivalCenterX,
          y: festivalCenterY - y,
      };
    case 2:
      return {
        x: x - festivalCenterX,
          y: festivalCenterY - y,
      };
    case 3:
      return {
        x: x - festivalCenterX,
          y: festivalCenterY - y,
      };
    case 4:
      return {
        x: x - festivalCenterX,
          y: festivalCenterY - y,
      };
    default:
      return null;
  }
}

module.exports = {
  switchPoint
}