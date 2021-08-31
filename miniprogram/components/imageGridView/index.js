// components/imageGridView/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    imageListProps: Array
  },

  /**
   * 组件的初始数据
   */
  data: {
    imageList: [],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    previewImage: function (e) {
      const current = e.target.dataset.src
      wx.previewImage({
        current,
        urls: this.data.imageList
      })
    },
  },

  observers: {
    'imageListProps': function (imageListProps) {
      this.setData({ imageList: imageListProps })
    }
  }
})
