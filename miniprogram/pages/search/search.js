var common = require("../../common.js");
import Dialog from '../../dist/dialog/dialog';
import Toast from '../../dist/toast/toast';
var db = wx.cloud.database();
var _ = db.command;
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (e) {
    var n_timestamp = new Date().getTime();
    var Tdays = 1000 * 60 * 60 * 24 * 30;//计算30天毫秒数
    var p_timestamp = n_timestamp - Tdays;//计算30天前的时间戳，下方进行比对
    this.setData({
      key:e.key,
      p_timestamp: p_timestamp
    })
    this.list();
  },

  list() {
    var that = this;
    var key = that.data.key;
    wx.setNavigationBarTitle({
      title: that.data.key+'的搜索结果',
    })
    wx.showLoading({
      title: '加载中',
    })
    var p_timestamp = that.data.p_timestamp;
    db.collection('sell').where({
      onsell: 'on',
      timestamp: _.gt(p_timestamp),
      key: {
        $regex: '.*' +key + '.*' ,
        $options: 'i'
      }
    }).limit(10).orderBy('timestamp', 'desc')
      .get({
        success(e) {
          console.log(e);
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
    var p_timestamp = that.data.p_timestamp;
    db.collection('sell').where({
      onsell: 'on',
      timestamp: _.gt(p_timestamp),
      key: {
        $regex: '.*' + key + '.*',
        $options: 'i'
      }
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
  search() {
   this.list();
  },
  inputKey(e) {
    this.data.key = e.detail;
  },
  onShareAppMessage: function () {
    return {
      title: app.globalData.share_title,
      path: "/pages/index/index",
      imageUrl: app.globalData.share_url
    };
  },

})