// miniprogram/pages/postList/postlist.js
const db = wx.cloud.database()
const postCollection = db.collection('post')
const { formatDateStr, getUserInfoAndPermission } = require('../../utils/index')

const MAX_LIMIT = 6
const FIRST_PAGE = 0

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasUserInfo: false,
    hasPermissionToPost: false,
    page: FIRST_PAGE,
    totalCount: 0,
    list: null
  },

  onGetUserProfileFinish: function (e) {
    const { userInfo, hasPermission } = e.detail
    
    this.setData({
      hasUserInfo: !!userInfo,
      hasPermissionToPost: hasPermission,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {

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
    const { userInfo, hasPermission } = await getUserInfoAndPermission()
    this.setData({
      hasPermissionToPost: hasPermission,
      hasUserInfo: (!!userInfo && Object.keys(userInfo).length),
    })

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

  onTapPlusBtn: function () {
    wx.navigateTo({
      url: '../postSend/postsend',
      events: {
        onPostComplete: ({ newPost }) => {
          const newList = this.data.list
          newList.unshift({
            ...newPost,
            dateStr: '刚刚',
          });
          this.setData({
            list: newList
          })
        }
      }
    })
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