var app = getApp();
import Dialog from '../../dist/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    car_list: [{
      title: '在线书籍',
      content: '在售的书都在这',
      key: 'onshow',
      img: 'https://qiniu.98api.cn/cqubook/img/my/yes.png'
    },
    {
      title: '下架书籍',
      content: '转让的书都在这',
      key: 'outshow',
      img: 'https://qiniu.98api.cn/cqubook/img/my/not.png'
    },
    {
      title: '使用教程',
      content: '常见问题都在这',
      key: 'help',
      img: 'https://qiniu.98api.cn/cqubook/img/my/help.png'
      },
      {
        title: '关于程序',
        content: '相关信息都在这',
        key: 'about',
        img: 'https://qiniu.98api.cn/cqubook/img/my/about.png'
    }]
  },
check_login(e){
console.log(e);
  var key = e.currentTarget.dataset.key;
  if (app.globalData.haved || key == 'about' || key == 'help' || key == 'register' ) {
     wx.navigateTo({
       url: '/pages/'+key+'/'+key,
     });
    } else {
      Dialog.confirm({
        title: '错误提示',
        message: '您还未补全信息，暂无法查看，赶快去填写吧~',
        closeOnClickOverlay: true
      }).then(() => {
        wx.navigateTo({
          url: '/pages/register/register',
        })
      }).catch(() => {
        // on cancel
      });
    }
  },
onShow(){
  this.setData({
    userinfo:app.globalData.userinfo
  });
  console.log(app.globalData)
},
  onShareAppMessage: function () {
    return {
      title: app.globalData.share_title,
      path: "/pages/index/index",
      imageUrl: app.globalData.share_url
    };
  },

})