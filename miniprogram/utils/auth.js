const app = getApp()
const db = wx.cloud.database()
const userinfoCollection = db.collection('userinfo')

/**
 * @description 从云函数获取 openId，并存入 globalData
 * @return {openid}: string
 */
async function getOpenId () {
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
      throw Error('请求云函数 getOpenId 失败')
    }
  }
  return app.globalData.openId
}

async function getUserInfoByOpenId (openId) {
  if (!app.globalData.userInfo || !Object.keys(app.globalData.userInfo).length) {
    const { data: [firstRecord] } = await userinfoCollection.where({ _openid: openId }).limit(1).get()
    const { userInfo, hasPermission } = firstRecord || {}
    // 存入 globalData
    app.globalData.userInfo = userInfo
    app.globalData.hasPermission = hasPermission
  }
  return {
    hasPermission: app.globalData.hasPermission,
    userInfo: app.globalData.userInfo
  }
}

/**
 * @description
 * @return {
 *   openId: 用户的 OpenId
 *   userInfo: 用户昵称头像等信息
 *   hasPermission: 是否为管理员权限
 * }
 */
export async function getUserInfoAndPermission () {
  const openId = await getOpenId()
  const { userInfo, hasPermission } = await getUserInfoByOpenId(openId)
  return {
    openId,
    userInfo,
    hasPermission,
  }
}