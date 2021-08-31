# Kiki 专属小程序

## 微信扫码体验

![](./code.png)

## 项目结构

```
.
├── cloudfunctions                # 云函数目录
│   └── quickstartFunctions       # 函数名
│       ├── config.json
│       ├── getMiniProgramCode    # 获取小程序二维码
│       │   └── index.js
│       ├── getOpenId             # 获取openId
│       │   └── index.js
│       └── index.js              # 云函数入口函数
├── miniprogram                   # 小程序目录
│   ├── lib                       # 第三方库
│   │   └── weui.wxss
│   ├── images                    # 图片素材
│   ├── pages                     # Page 目录
│   │   ├── memory                # 轨迹页
│   │   │   ├── index.js
│   │   │   ├── index.json
│   │   │   ├── index.wxml
│   │   │   └── index.wxss
│   │   ├── postList              # 笔记本页
│   │   │   ├── postlist.js
│   │   │   ├── postlist.json
│   │   │   ├── postlist.wxml
│   │   │   └── postlist.wxss
│   │   └── postSend              # 发布新笔记页
│   │       ├── postsend.js
│   │       ├── postsend.json
│   │       ├── postsend.wxml
│   │       └── postsend.wxss
│   ├── components                # Component 组件目录
│   ├── app.js                    # 小程序入口
│   ├── app.json
│   ├── app.wxss
│   ├── config.js                 # 配置文件，可配置允许发布新笔记的 OpenId
│   └── utils                     # 工具目录
│       └── format.js
├── project.config.json
├── project.private.config.json
├── LICENSE
├── CHANGELOG.md
└── README.md
```

## 变更日志

详见 [CHANGELOG.md](./CHANGELOG.md)

## 开发者参考文档

- [云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)

## 开源许可证

该小程序源码在 [MIT](./LICENSE) 许可证下提供
