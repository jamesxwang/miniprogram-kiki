// miniprogram/pages/postSend/postsend.js
const db = wx.cloud.database()
const postCollection = db.collection('post')
const { getUserInfoAndPermission } = require('../../utils/auth')
const { formatDateStr } = require('../../utils/format')

const SOURCE_TYPE = [
  ['camera'], // 拍照
  ['album'], // 相册
  ['camera', 'album'] // 拍照或相册
]
const SIZE_TYPE = [
  ['compressed'], // 压缩
  ['original'], // 原图
  ['compressed', 'original'] // 压缩或原图
]

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasUserInfo: false,
    hasPermissionToPost: false,
    userInfo: {},
    inputValue: '',
    sourceType: SOURCE_TYPE[2],
    sizeType: SIZE_TYPE[0],
    count: 9,
    files: [],
    showLoading: false,
    loadingTips: '加载中...',
    date: '2022-01-01',
    time: '00:00',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      chooseImage: this.chooseImage.bind(this),
    })
  },

  onGetUserProfileFinish: function (e) {
    const { userInfo, hasPermission } = e.detail
    
    this.setData({
      hasUserInfo: !!userInfo,
      hasPermissionToPost: hasPermission,
    })
  },

  bindDateChange(e) {
    this.setData({
      date: e.detail.value,
    });
  },
  bindTimeChange(e) {
    this.setData({
      time: e.detail.value,
    });
  },

  chooseImage: function (e) {
    const { tempFilePaths } = e.detail
    this.setData({
      files: this.data.files.concat(tempFilePaths.map(url => ({ url })))
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const eventChannel = this.getOpenerEventChannel()
    this.setData({ eventChannel })
  },

  bindKeyInput(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  uploadImgWithUserProfile: async function() {
    console.log('this.data.files', this.data.files)
    if (!this.data.inputValue && !this.data.files.length) {
      wx.showToast({
        title: '不能发布空内容哦',
        icon: 'none',
        duration: 1000
      })
      return
    }
    try {
      const { userInfo } = await getUserInfoAndPermission()
      this.setData({ userInfo })
      this.uploadImg()
    } catch (error) {
      this.setData({
        error,
        showLoading: false,
      })
    }
  },

  uploadImg: async function() {
    try {
      const now = new Date(`${this.data.date} ${this.data.time}`);
      this.setData({
        showLoading: true,
        loadingTips: '上传图片中...'
      })

      const resList = await Promise.all(this.data.files.map((image, index) => {
        const filename = `${formatDateStr(now, 'yyyy-MM-dd-hh-mm-ss')}-${index}.png`
        return wx.cloud.uploadFile({
          cloudPath: filename,
          filePath: image.url // 图片路径
        })
      }))

      this.setData({
        loadingTips: '发布笔记中...'
      })

      const newPost = {
        userInfo: this.data.userInfo,
        message: this.data.inputValue,
        imageFileIDList: resList.map(({ fileID }) => fileID),
        isDeleted: false,
        createTime: db.serverDate({
          offset: now.getTime() - new Date().getTime()
        })
      }
      // console.log({ newPost })
      await postCollection.add({
        data: newPost
      })
      this.setData({ showLoading: false })
      wx.navigateBack({
        complete: () => {
          this.data.eventChannel.emit('onPostComplete', { newPost })
        }
      })
    } catch (error) {
      console.log(error)
      this.setData({
        error,
        showLoading: false,
      })
    }

  }
})