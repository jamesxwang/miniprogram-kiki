// miniprogram/pages/memory/index.js
const db = wx.cloud.database()
const anniversary = db.collection('anniversary')
const { getUserInfoAndPermission } = require('../../utils/auth');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasUserInfo: false,
    totalDay: 0,
    list: [
      { id: 99, desc: "99天" },
      { id: 365, desc: "365天" },
      { id: 520, desc: "520天" },
      { id: 999, desc: "999天" },
      { id: 1095, desc: "3年" },
      { id: 1314, desc: "1314天" },
      { id: 2920, desc: "8年" },
      { id: 3000, desc: "3000天" },
      { id: 3285, desc: "9年" },
      { id: 36135, desc: "99年" },
      { id: 3650000, desc: "10000年" },
    ],
  },

  onGetUserProfileFinish: function (e) {
    const { userInfo } = e.detail
    this.setData({ hasUserInfo: !!userInfo })
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
    const { userInfo } = await getUserInfoAndPermission()
    this.setData({
      hasUserInfo: (!!userInfo && Object.keys(userInfo).length),
    })

    const { data } = await anniversary.get()
    const [firstRecord] = data
    const startSecond = new Date(firstRecord.loveBegin).getTime() / 1000
    const totalDay = Math.floor((new Date().getTime() / 1000 - startSecond) / 3600 / 24)

    const list = this.data.list
    for (let i = 0, len = list.length; i < len; ++i) {
      const gap = list[i].id - totalDay
      list[i].gap = Math.abs(gap)
      if (gap >= 0) {
        list[i].pre = "距离恋爱"
        list[i].center = "还有"
        list[i].end = "天"
        list[i].finish = false
      } else {
        list[i].pre = "恋爱"
        list[i].center = ""
        list[i].end = " ✓"
        list[i].finish = true
      }
    }

    this.setData({
      totalDay: totalDay,
      list: list,
      videoShow: false,
      clickTimes: 0
    })

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
    return {
      title: 'Kiki 专属小程序 - 轨迹',
      path: 'pages/memory/index'
    }
  }
})