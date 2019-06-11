//app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'book-8sn74',
        traceUser: true,
      })
    }
  },
  globalData: {
    haved:false,
    share_title: "「重庆大学二手书」快来分享你的僵尸书吧",
    share_url: "https://qiniu.98api.cn/cqubook/share.php"
  },
  url: 'https://github.com/xuhuai66'
})
