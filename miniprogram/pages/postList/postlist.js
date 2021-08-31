// miniprogram/pages/postList/postlist.js
const app = getApp()
const db = wx.cloud.database()
const postCollection = db.collection('post')
const MAX_LIMIT = 6
const FIRST_PAGE = 0
const { formatDateStr } = require('../../utils/format');
const { adminOpenIds } = require('../../config')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasPermissionToPost: false,
    page: FIRST_PAGE,
    totalCount: 0,
    list: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    if (!app.globalData.openId) {
      try {
        wx.showLoading({
          title: 'loading...',
        })
        const { result: { openid } } = await wx.cloud.callFunction({
          name: 'quickstartFunctions',
          data: {
            type: 'getOpenId'
          }
        })

        // 存入 globalData
        app.globalData.openId = openid
        wx.hideLoading()
      } catch (error) {
        wx.hideLoading()
      }
    }
    this.checkPostPermission()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: async function () {
    if (this.data.list !== null) {
      return
   }

    wx.showLoading({
      title: 'loading...',
    })

    if (!this.data.totalCount) {
      const { total } = await postCollection.count()
      this.setData({
        totalCount: total
      })
    }

    this.onPullDownRefresh()
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
    this.setData({
      page: FIRST_PAGE,
      list: []
    })
    this.loadData()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.loadData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: 'Kiki 专属小程序 - 笔记本',
      path: 'pages/postList/postlist'
    }
  },

  checkPostPermission: function () {
    if (adminOpenIds.includes(app.globalData.openId)) {
      this.setData({
        hasPermissionToPost: true,
      })
    }
  },

  loadData: async function () {
    if (this.data.totalCount <= this.data.page * MAX_LIMIT) {
      wx.showToast({
        title: '没有更多啦',
        icon: 'loading',
        duration: 300
      })
      return
    }

    wx.showToast({
      title: 'loading',
      icon: 'loading',
      duration: 5000
    })

    const { data = [] } = await postCollection
      .where({
        isDeleted: false
      })
      .orderBy('createTime', 'desc')
      .skip(this.data.page * MAX_LIMIT)
      .limit(MAX_LIMIT)
      .get()

    const dataWithHandledDate = data.map((item) => ({
      ...item,
      dateStr: formatDateStr(item.createTime)
    }))
    const originList = this.data.list
    const newList = originList.concat(dataWithHandledDate);
    this.setData({
      list: newList
    })
    this.setData({
      page: this.data.page + 1
    })
    wx.hideToast()
    wx.stopPullDownRefresh();
  }
})