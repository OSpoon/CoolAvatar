import ImageSynthesis from './image-synthesis.js';
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

const saveImage = (data, avatarUrl, {
  canvasid,
  width,
  height
}, callback) => {
  const {
    festivalLeft,
    festivalTop,
    festivalSize,
    festivalSrc = '',
    rotate,
  } = data;
  if (festivalSrc !== '' && avatarUrl !== '') {
    const imageSynthesis = new ImageSynthesis(this, canvasid, width, height);
    imageSynthesis.addImage({
      path: avatarUrl,
      x: 0,
      y: 0,
      w: 280,
      h: 280
    });
    const rc = imageSynthesis.switchRect({
      x: festivalLeft,
      y: festivalTop,
      w: festivalSize,
      h: festivalSize,
    });
    imageSynthesis.addImage({
      path: festivalSrc,
      x: rc.x,
      y: rc.y,
      w: rc.w,
      h: rc.h,
      deg: rotate
    });
    imageSynthesis.startCompound((img) => {
      callback && callback(img)
    });
  }
}

module.exports = {
  formatTime,
  saveImage
}