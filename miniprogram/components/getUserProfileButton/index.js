// components/getUserInfoButton/index.js
const app = getApp()
const db = wx.cloud.database()
const userinfoCollection = db.collection('userinfo')
const { adminOpenIds } = require('../../config')
const { throttle } = require('../../utils/throttle')

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  observers: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    throttledGetUserProfile: throttle(function () {
      this.getUserProfile()
    }),
    async getUserProfile () {
      // 如果用户表中没有信息（即新用户），则存到表中
      const { userInfo } = await wx.getUserProfile({
        desc: '用于获取用户昵称和头像', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      })

      try {
        const hasPermission = adminOpenIds.includes(app.globalData.openId)
        const { data } = await userinfoCollection.where({ _openid: app.globalData.openId }).get()
        if (data?.length === 0) {
          userinfoCollection.add({
            data: {
              userInfo,
              hasPermission,
            }
          })
        } else {
          const [{ _id }] = data
          userinfoCollection.doc(_id).update({
            data: {
              userInfo,
              hasPermission,
            },
          })
        }
        app.globalData.userInfo = userInfo
        app.globalData.hasPermission = hasPermission
        this.triggerEvent('onGetUserProfileFinish', { userInfo, hasPermission })
      } catch (error) {
        console.log(error)
      }
    }
  }

})
