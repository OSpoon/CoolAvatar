import ImageSynthesis from './image-synthesis.js';

const saveImage = (data, avatarUrl, {
  canvasid,
  width,
  height,
  offsetTop,
  offsetLeft,
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
      w: width,
      h: height
    });
    const rc = imageSynthesis.switchRect({
      x: festivalLeft - offsetLeft,
      y: festivalTop - offsetTop,
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
  saveImage
}