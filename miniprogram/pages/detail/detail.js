var common = require("../../common.js");
import Dialog from '../../dist/dialog/dialog';
import Toast from '../../dist/toast/toast';
var db = wx.cloud.database();
var app = getApp();
Page({

  data: {
    painting: {},
    show: false,
  },

  onLoad(e){
    console.log(e);
   //var key= Object.keys(e)[0];
    var key = e.scene;
    this.data.key=key;
    this.detail(key);
    this.login();
  },
detail(e){
  var that = this;
  wx.showLoading({
    title: '加载中',
  })
  db.collection('sell').doc(e).get({
    success: function (res) {
      var openid = res.data._openid;
      that.get_user(openid);
      that.setData({
        detail:res.data
      })
    }
  })
},
home(){
  wx.switchTab({
    url: '/pages/index/index'
  })
},
get_user(e){
  var that = this;
  db.collection('user')
    .where({
      _openid: e
    }).get({
      success(e) {
       that.setData({
         userinfo:e.data[0]
       })
       console.log(that.data.userinfo)
       wx.hideLoading();
      }
    })
},
  onShareAppMessage() {
    var e = this.data.detail;
    return {
      title: '这里有一本《'+e.bookinfo.title+'》'+e.selling+'元转让，快来看看吧',
      imageUrl: e.bookinfo.pic,
      path: '/pages/detail/detail?scene='+e._id
    }
  },

check_draw(){
if(app.globalData.haved){
  this.qrcode();
}else{
  Dialog.confirm({
    title: '错误提示',
    message: '您还未补全信息，暂无法生成海报哟，赶快去填写吧~',
    closeOnClickOverlay:true
  }).then(() => {
    wx.navigateTo({
      url: '/pages/register/register',
    })
  }).catch(() => {
    // on cancel
  });
}
},

  eventDraw() {
    var e = this.data.detail;
    console.log(e)
    wx.showLoading({
      title: '绘制海报中',
      mask: true
    })
    this.setData({
      painting: {
        width: 375,
        height: 555,
        clear: true,
        views: [
          {
            type: 'image',
            url: 'https://hybrid.xiaoying.tv/miniprogram/viva-ad/1/1531103986231.jpeg',
            top: 0,
            left: 0,
            width: 375,
            height: 555
          },
          {
            type: 'image',
            url: app.globalData.userinfo.avatarUrl,
            top: 27.5,
            left: 29,
            width: 55,
            height: 55
          },
          {
            type: 'image',
            url: 'https://hybrid.xiaoying.tv/miniprogram/viva-ad/1/1531401349117.jpeg',
            top: 27.5,
            left: 29,
            width: 55,
            height: 55
          },
          {
            type: 'text',
            content: '您的好友【'+app.globalData.userinfo.nickName+'】',
            fontSize: 16,
            color: '#402D16',
            textAlign: 'left',
            top: 33,
            left: 96,
            bolder: true
          },
          {
            type: 'text',
            content: '发现一本好书，邀请你一起便宜免费拿！',
            fontSize: 15,
            color: '#563D20',
            textAlign: 'left',
            top: 59.5,
            left: 96
          },
          {
            type: 'image',
            url: e.bookinfo.pic,
            top: 136,
            left: 94.5,
            width: 186,
            height: 186
          },
          {
            type: 'image',
            url: this.data.q_url,
            top: 443,
            left: 85,
            width: 68,
            height: 68
          },
          {
            type: 'text',
            content: e.bookinfo.title+'(第'+e.bookinfo.edition+')',
            fontSize: 16,
            lineHeight: 21,
            color: '#383549',
            textAlign: 'left',
            top: 336,
            left: 44,
            width: 287,
            MaxLineNumber: 1,
            breakWord: true,
            bolder: true
          },
          {
            type: 'text',
            content: e.bookinfo.author,
            fontSize: 15,
            lineHeight: 21,
            color: '#383549',
            textAlign: 'left',
            top: 361,
            left: 44,
            width: 287,
            MaxLineNumber: 1,
            breakWord: true,
            bolder: true
          },
          {
            type: 'text',
            content: '￥'+e.selling+'.00',
            fontSize: 19,
            color: '#E62004',
            textAlign: 'left',
            top: 387,
            left: 44.5,
            bolder: true
          },
          {
            type: 'text',
            content: '原价:￥'+e.bookinfo.price,
            fontSize: 13,
            color: '#7E7E8B',
            textAlign: 'left',
            top: 391,
            left: 110,
            textDecoration: 'line-through'
          },
          {
            type: 'text',
            content: '长按识别图中二维码快来抢书呀~',
            fontSize: 14,
            color: '#383549',
            textAlign: 'left',
            top: 460,
            left: 165.5,
            lineHeight: 20,
            MaxLineNumber: 2,
            breakWord: true,
            width: 125
          }
        ]
      }
    })
  },
  eventGetImage(event) {
    console.log(event)
    wx.hideLoading()
    const { tempFilePath, errMsg } = event.detail
    if (errMsg === 'canvasdrawer:ok') {
      this.setData({
        shareImage: tempFilePath,
        show:true
      })
    }
  },
 save_poster() {
    wx.saveImageToPhotosAlbum({
      filePath: this.data.shareImage,
      success(res) {
        wx.showToast({
          title: '保存图片成功',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
  onClose() {
    this.setData({ close: false, painting: {}, });
  },
  //复制手机号
  copy() {
    wx.setClipboardData({
      data: this.data.userinfo.contact,
      success: res => {
        wx.showToast({
          title: '已复制'+this.data.userinfo.kind,
          duration: 1000,
        })
      }
    })
  },
buy(){
  wx.setClipboardData({
    data: this.data.userinfo.contact,
    success: res => {
      wx.hideToast();
      Dialog.alert({
        message: '恭喜您已复制转让同学的' + this.data.userinfo.kind + '，赶快去联系吧~',
        closeOnClickOverlay:true,
      }).then(() => {
      });
    }
  })
},
  //检测是否登录
  login() {
    var that = this;
    var userinfo = wx.getStorageSync('user')
    if (userinfo) {
      app.globalData.haved = true;
      app.globalData.openid = userinfo._openid;
      app.globalData.userinfo = userinfo;
    } else {
      wx.cloud.callFunction({
        name: 'login',
        complete: res => {
          var openid = res.result.openid;
          app.globalData.openid = openid;//全局变量openid
          db.collection('user')
            .where({
              _openid: openid
            }).get({
              success(e) {
                if (e.data == '') {
                  console.log(app.globalData)
                } else {
                  var userinfo = e.data[0];
                  app.globalData.userinfo = userinfo;
                  wx.setStorageSync('user', userinfo);
                  app.globalData.haved = true;
                  console.log(app.globalData)
                }
              }
            })
        }
      })
    }
  },
qrcode(){
    var that = this;
  var url = 'https://qiniu.98api.cn/cqubook/qrcode.php?id=' + that.data.key;
    common.get(url).then((res) => {
      var q_url = res.data.replace('./', 'https://qiniu.98api.cn/cqubook/');
      console.log(q_url);
      that.setData({
        q_url: q_url
      });
      that.eventDraw();
    })
}

})