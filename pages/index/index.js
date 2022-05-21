// index.js
const {
  switchPoint
} = require('../../utils/material-utils');
const {
  saveImage
} = require('../../utils/util');

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false,
    // 素材集合
    material: [{
      name: '1',
      url: '../images/material/1.png',
      selected: false,
    }, {
      name: '2',
      url: '../images/material/2.png',
      selected: false,
    }, {
      name: '3',
      url: '../images/material/3.png',
      selected: false,
    }, {
      name: '4',
      url: '../images/material/4.png',
      selected: false,
    }, {
      name: '5',
      url: '../images/material/5.png',
      selected: false,
    }, {
      name: '6',
      url: '../images/material/6.png',
      selected: false,
    }, {
      name: '7',
      url: '../images/material/7.png',
      selected: false,
    }, {
      name: '8',
      url: '../images/material/8.png',
      selected: false,
    }, {
      name: '9',
      url: '../images/material/9.png',
      selected: false,
    }, {
      name: '10',
      url: '../images/material/10.png',
      selected: false,
    }, {
      name: '1',
      url: '../images/material/11.png',
      selected: false,
    }, {
      name: '12',
      url: '../images/material/12.png',
      selected: false,
    }, {
      name: '13',
      url: '../images/material/13.png',
      selected: false,
    }, {
      name: '14',
      url: '../images/material/14.png',
      selected: false,
    }, {
      name: '15',
      url: '../images/material/15.png',
      selected: false,
    }, {
      name: '16',
      url: '../images/material/16.png',
      selected: false,
    }, {
      name: '17',
      url: '../images/material/17.png',
      selected: false,
    }, {
      name: '18',
      url: '../images/material/18.png',
      selected: false,
    }],
    festivalSrc: '',
    isTouchScale: false,
    hasScale: false,
    hasRotate: false,
    festivalCenterX: 0,
    festivalCenterY: 0,
    festivalLeft: 120,
    festivalTop: 120,
    offsetx: 0,
    offsety: 0,
    festivalSize: 80,
    oldx: 0,
    oldy: 0,
    startx: 0,
    starty: 0,
    initRotate: 0,
    rotate: 0,

    loading: false,
    isOpenSetting: false,
  },

  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },

  /**
   * 去设置权限
   * @param {*} e 
   */
  handlerOpenSetting(e) {
    wx.openSetting({})
    this.setData({
      isOpenSetting: false,
    });
  },

  /**
   * 获取用户信息，主要是头像
   * @param {*} e 
   */
  getUserProfile(e) {
    wx.getUserProfile({
      desc: '展示用户头像',
      success: (res) => {
        const index = res.userInfo.avatarUrl.lastIndexOf('/132');
        if (index != -1) {
          res.userInfo.avatarUrl = res.userInfo.avatarUrl.substring(0, index) + '/0';
        }
        const {
          material
        } = this.data;
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: res.userInfo != null,
          festivalSrc: material[0].url,
        });
      }
    })
  },

  /**
   * 保存下来
   * @param {*} e 
   */
  clickMakeNewImage(e) {
    if (this.data.loading) {
      return;
    }
    this._checkAndAuthorize('scope.writePhotosAlbum', (isok) => {
      if (isok) {
        this.setData({
          loading: true,
        });
        wx.showLoading({
          title: '不要走开...',
        });
        const {
          userInfo
        } = this.data;

        wx.downloadFile({
          url: userInfo.avatarUrl,
          success: (res) => {
            console.log(res)
            saveImage(this.data, res.tempFilePath, {
              canvasid: 'festivalCanvas',
              width: 700,
              height: 700,
              offsetTop: 0,
              offsetLeft: 0,
            }, (img) => {
              wx.hideLoading();
              if (img) {
                this.saveImageToPhotosAlbum(img)
              }
            });
          },
          fail: (res) => {
            console.log(res)
            this.data.loading = false;
            wx.showToast({
              title: '获取微信图像失败',
              icon: 'none'
            });
          },
        });
      }
    });
  },

  /**
   * 保存头像到相册
   * @param {*} filePath 
   */
  saveImageToPhotosAlbum(filePath) {
    if (filePath) {
      this.data.loading = false;
      wx.saveImageToPhotosAlbum({
        filePath,
        success: (res) => {
          wx.showToast({
            title: '保存到相册成功',
          });
        }
      });
    }
  },

  /**
   * 检查权限并提示开启
   * @param {*} scope 
   * @param {*} callback 
   */
  _checkAndAuthorize(scope, callback) {
    const self = this;
    wx.getSetting({
      success(res) {
        console.log('getSetting success')
        console.log(res)
        if (!res.authSetting[scope]) {
          wx.authorize({
            scope,
            success() {
              console.log('authorize success')
              callback && callback(true);
            },
            fail() {
              console.log('authorize fail')
              self.setData({
                isOpenSetting: true,
              });
            }
          })
        } else {
          callback && callback(true);
        }
      },
      fail(err) {
        console.log('getSetting fail')
        console.log(err)
      }
    })
  },

  /**
   * 切换下一个素材
   * @param {*} e 
   */
  clickFestivalImage(e) {
    const {
      url
    } = e.currentTarget.dataset.index;
    const {
      material
    } = this.data;
    const newMaterial = material.map((v => {
      v.selected = false;
      if (v.url === url) v.selected = true;
      return v;
    }))
    this.setData({
      material: newMaterial,
      festivalSrc: url,
    })
  },

  /**
   * 重置素材参数，重新设置
   */
  clickMakeResetImage() {
    this._reset();
  },

  _reset(e) {
    this.setData({
      isTouchScale: false,
      hasScale: false,
      hasRotate: false,
      festivalCenterX: 0,
      festivalCenterY: 0,
      festivalLeft: 120,
      festivalTop: 120,
      offsetx: 0,
      offsety: 0,
      festivalSize: 80,
      oldx: 0,
      oldy: 0,
      startx: 0,
      starty: 0,
      initRotate: 0,
      rotate: 0,
      logoPath: null,
    });
  },

  festivalImageRaoteTouchStart(e) {
    this.data.isTouchScale = true;
    this.data.initRotate = this.data.rotate;
    const x = e.touches[0].pageX;
    const y = e.touches[0].pageY;
    this.data.startx = x;
    this.data.starty = y;
    this.data.oldx = x;
    this.data.oldy = y;
    this.data.festivalCenterX = this.data.festivalLeft + this.data.festivalSize / 2.0;
    this.data.festivalCenterY = this.data.festivalTop + this.data.festivalSize / 2.0;
    this.data.hasRotate = true;
    this.data.hasScale = true;
    this.data.offsetx = x - this.data.festivalLeft;
    this.data.offsety = y - this.data.festivalTop;
  },

  festivalImageRaoteTouchMove(e) {
    this._handlefestivalImageMoveScale(e);
  },

  festivalImageRaoteTouchEnd(e) {
    this._handlefestivalImageMoveScale(e);
    this.data.isTouchScale = false;
  },

  festivalImageTouchStart(e) {
    if (this.data.isTouchScale) {
      return;
    }
    const x = e.touches[0].pageX;
    const y = e.touches[0].pageY;
    this.data.startx = x;
    this.data.starty = y;
    this.data.oldx = x;
    this.data.oldy = y;
    this.data.festivalCenterX = this.data.festivalLeft + this.data.festivalSize / 2.0;
    this.data.festivalCenterY = this.data.festivalTop + this.data.festivalSize / 2.0;
    this.data.hasRotate = false;
    this.data.hasScale = false;
    this.data.offsetx = x - this.data.festivalLeft;
    this.data.offsety = y - this.data.festivalTop;
  },

  festivalImageTouchMove(e) {
    if (this.data.isTouchScale) {
      return;
    }
    this._handlefestivalImageMoveScale(e);
  },

  festivalImageTouchEnd(e) {
    if (this.data.isTouchScale) {
      return;
    }
    this._handlefestivalImageMoveScale(e);
  },

  _handlefestivalImageMoveScale(e) {
    if (e.touches.length > 0) {
      const {
        oldx = 0,
          oldy = 0,
          festivalCenterX = 0,
          festivalCenterY = 0,
          hasRotate,
          hasScale,
          offsety,
          offsetx,
          rotate,
      } = this.data;
      const x = e.touches[0].pageX;
      const y = e.touches[0].pageY;
      if (hasRotate || hasScale) {
        const a = Math.sqrt(Math.pow(Math.abs(x - festivalCenterX), 2) + Math.pow(Math.abs(y - festivalCenterY), 2));
        const b = Math.sqrt(Math.pow(Math.abs(oldx - festivalCenterX), 2) + Math.pow(Math.abs(oldy - festivalCenterY), 2));
        const c = Math.sqrt(Math.pow(Math.abs(oldx - x), 2) + Math.pow(Math.abs(oldy - y), 2));
        const cosa = (Math.pow(a, 2) + Math.pow(b, 2) - Math.pow(c, 2)) / (2 * a * b);
        const ra = Math.abs(Math.acos(cosa) / (Math.PI / 180));
        const a1 = switchPoint(this.data, oldx, oldy);
        const b1 = switchPoint(this.data, x, y);
        const sunshi = a1.x * b1.y - a1.y * b1.x;
        const newsize = Math.sqrt(Math.pow(a * 2, 2) / 2);
        if (sunshi != 0) {
          const rotateSshi = sunshi < 0;
          this.setData({
            festivalTop: festivalCenterY - newsize / 2.0,
            festivalLeft: festivalCenterX - newsize / 2.0,
            festivalSize: newsize,
            rotate: rotate + (rotateSshi ? ra : -ra),
            oldx: x,
            oldy: y,
          });
        } else {
          this.setData({
            festivalTop: festivalCenterY - newsize / 2.0,
            festivalLeft: festivalCenterX - newsize / 2.0,
            festivalSize: newsize,
            oldx: x,
            oldy: y,
          });
        }
      } else {
        this.setData({
          festivalTop: y - offsety,
          festivalLeft: x - offsetx,
          oldx: x,
          oldy: y,
        });
      }
    }
  },
})