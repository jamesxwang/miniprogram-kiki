// miniprogram/pages/postSend/postsend.js
const db = wx.cloud.database()
const postCollection = db.collection('post')
const { formatDateStr, getUserInfoAndPermission } = require('../../utils/index')

const sourceType = [
  ['camera'],
  ['album'],
  ['camera', 'album']
]
const sizeType = [
  ['compressed'],
  ['original'],
  ['compressed', 'original']
]

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    inputValue: '',
    imageList: [],
    sourceTypeIndex: 2,
    sourceType: ['拍照', '相册', '拍照或相册'],
    sizeTypeIndex: 0,
    sizeType: ['压缩', '原图', '压缩或原图'],
    countIndex: 8,
    count: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    reachedMaxUploadCount: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const eventChannel = this.getOpenerEventChannel()
    this.setData({ eventChannel })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  bindKeyInput(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  previewImage: function (e) {
    const current = e.target.dataset.src
    wx.previewImage({
      current,
      urls: this.data.imageList
    })
  },

  chooseImage: async function () {
    const maxAllowCount = this.data.count[this.data.countIndex]
    const curImagesCount = this.data.imageList.length
    const allowUploadImageCount = maxAllowCount - curImagesCount

    const { tempFilePaths } = await wx.chooseImage({
      sourceType: sourceType[this.data.sourceTypeIndex],
      sizeType: sizeType[this.data.sizeTypeIndex],
      count: allowUploadImageCount,
    })
    const newImageList = this.data.imageList.concat(tempFilePaths)
    this.setData({
      imageList: newImageList
    })

    if (newImageList.length >= maxAllowCount) {
      this.setData({
        reachedMaxUploadCount: true
      })
    }
  },

  uploadImgWithUserProfile: async function() {
    if (!this.data.inputValue && !this.data.imageList.length) {
      wx.showToast({
        title: '不能发布空内容哦',
        icon: 'none',
        duration: 1000
      })
      return
    }
    const { userInfo } = await getUserInfoAndPermission()
    this.setData({ userInfo })
    this.uploadImg()
  },

  uploadImg: async function() {
    const now = new Date()

    wx.showLoading({
      title: 'uploading...',
    })
    try {
      const resList = await Promise.all(this.data.imageList.map((image, index) => {
        const filename = `${formatDateStr(now, 'yyyy-MM-dd-hh-mm-ss')}-${index}.png`
        return wx.cloud.uploadFile({
          cloudPath: filename,
          filePath: image // 文件路径
        })
      }))

      wx.showLoading({
        title: 'saving...',
      })

      const newPost = {
        userInfo: this.data.userInfo,
        message: this.data.inputValue,
        imageFileIDList: resList.map(({ fileID }) => fileID),
        isDeleted: false,
        createTime: db.serverDate()
      }

      await postCollection.add({
        data: newPost
      })

      wx.hideLoading()
      wx.navigateBack({
        complete: () => {
          this.data.eventChannel.emit('onPostComplete', { newPost })
        }
      })
    } catch (error) {
      console.log(error)
      wx.hideLoading()
    }

  }
})