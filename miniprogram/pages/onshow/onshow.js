var common = require("../../common.js");
import Dialog from '../../dist/dialog/dialog';
import Toast from '../../dist/toast/toast';
var db = wx.cloud.database();
var _ = db.command;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow(e) {
    console.log(app.globalData)
    this.setData({
      openid: app.globalData.openid,
      })
    this.list();
  },
  onPullDownRefresh() {
    this.list();
  },
  list() {
    var that = this;
    wx.showLoading({
      title: '刷新中',
    })
    db.collection('sell').where({
      onsell: 'on',
      _openid:that.data.openid
    }).limit(10).orderBy('timestamp', 'desc')
      .get({
        success(e) {
          wx.stopPullDownRefresh();
          wx.hideLoading();
          that.setData({
            page: 0,
            ["list[0]"]: e.data
          })
          console.log(that.data.list)
        }
      })
  },
  onReachBottom() {
    this.next();
  },
  next() {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    var page = that.data.page + 10;
    db.collection('sell').where({
      onsell: 'on',
      _openid: that.data.openid
    }).orderBy('timestamp', 'desc').skip(page).limit(10)
      .get({
        success(e) {
          wx.hideLoading();
          if (e.data == "") {
            Toast('已经到底了哟~');
          } else {
            that.setData({
              page: page,
              ["list[" + page + "]"]: e.data
            })
            console.log(that.data.list)
          }
        }
      })
  },


  goDetail(e) {
    console.log(e);
    wx.navigateTo({
      url: '/pages/detail/detail?scene=' + e.currentTarget.dataset.id,
    })
  },


  crash(e){
    var that = this;
    var _id = e.currentTarget.dataset.id;
    var timestamp = new Date().getTime();
    db.collection('sell').doc(_id).update({
      data: {
        timestamp: timestamp,
        day: common.nowDay(),
      },
      success(e){
        Toast('成功擦亮');
        that.list();
      }
    })
  },

  down(e) {
    var that = this;
    var detail = e.currentTarget.dataset.id;
    Dialog.confirm({
      title: '下架确认',
      message: '您确定要下架《' + detail.bookinfo.title + '（第' + detail.bookinfo.edition + '）》吗？下架后不可再发布，需重新添加',
      closeOnClickOverlay: true
    }).then(() => {
      db.collection('sell').doc(detail._id).update({
        data: {
          onsell: 'off'
        },
        success(e) {
          Toast('下架成功');
          that.list();
        }
      })
    }).catch(() => {
    });
  },
  onShareAppMessage: function () {
    return {
      title: app.globalData.share_title,
      path: "/pages/index/index",
      imageUrl: app.globalData.share_url
    };
  },

})