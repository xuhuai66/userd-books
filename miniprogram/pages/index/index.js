var common = require("../../common.js");
import Dialog from '../../dist/dialog/dialog';
import Toast from '../../dist/toast/toast';
var db = wx.cloud.database();
var _ = db.command;
var app = getApp();
Page({

  data: {
  },

  onLoad: function (options) {
    var n_timestamp = new Date().getTime();
    var Tdays = 1000 * 60 * 60 * 24 * 30;//计算30天毫秒数
    var p_timestamp = n_timestamp - Tdays;//计算30天前的时间戳，下方进行比对
    this.setData({
      p_timestamp: p_timestamp
    })
    this.list();
    this.login();
  },
onPullDownRefresh(){
this.list();
},

list(){
  var that = this;
   wx.showLoading({
     title: '加载中',
   })
  var p_timestamp = that.data.p_timestamp;
  db.collection('sell').where({
    onsell: 'on',
    timestamp: _.gt(p_timestamp)
  }).limit(10).orderBy('timestamp', 'desc')
    .get({
      success(e){
        wx.stopPullDownRefresh();
        wx.hideLoading();
       that.setData({
         page: 0,
         ["list[0]"]: e.data
       })
      }
    })
},
onReachBottom(){
  this.next();
},
next(){
  wx.showLoading({
    title: '加载中',
  })
var that = this;
var page = that.data.page+10;
var p_timestamp = that.data.p_timestamp;
  db.collection('sell').where({
    onsell: 'on',
    timestamp: _.gt(p_timestamp)
  }).orderBy('timestamp', 'desc').skip(page).limit(10)
    .get({
      success(e) {
        wx.hideLoading();
        if(e.data==""){
          Toast('已经到底了哟~');
        }else{
        that.setData({
          page:page,
          ["list[" + page + "]"]: e.data
        })
      }
      }
    })
},


 goDetail(e){
console.log(e);
wx.navigateTo({
  url: '/pages/detail/detail?scene=' + e.currentTarget.dataset.id,
})
 },
 search(){
   wx.navigateTo({
     url: '/pages/search/search?key='+this.data.key ,
   })
 },
 inputKey(e){
  this.data.key = e.detail;
 },

openid(){
  wx.cloud.callFunction({
    name: 'login',
    complete: res => {
      console.log(res)
    }
  })
},
//检测是否登录
login(){
var that = this;
var userinfo = wx.getStorageSync('user')
  if (userinfo) {
    app.globalData.haved = true;
    app.globalData.openid = userinfo._openid;
    app.globalData.userinfo = userinfo;
  }else{
  wx.cloud.callFunction({
    name: 'login',
    complete: res => {
       var openid = res.result.openid;
      app.globalData.openid = openid;//全局变量openid
      db.collection('user')
        .where({
          _openid: openid
        }).get({
       success(e){
         if(e.data==''){
           console.log(app.globalData)
         }else{
        var userinfo = e.data[0];
        app.globalData.userinfo = userinfo;
         wx.setStorageSync('user', userinfo);
         app.globalData.haved=true;
         console.log(app.globalData)
         }
       }
        })
    }
  })
  }
},
  onShareAppMessage: function () {
    return {
      title: app.globalData.share_title,
      path: "/pages/index/index",
      imageUrl: app.globalData.share_url
    };
  },







})