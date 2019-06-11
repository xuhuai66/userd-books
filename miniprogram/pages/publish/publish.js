var common = require("../../common.js");
import Dialog from '../../dist/dialog/dialog';
import Toast from '../../dist/toast/toast';
var db = wx.cloud.database();
var app = getApp();
Page({
  data: {
    steps: [
      {
        text: '步骤一',
        desc: '扫描isbn码'
      },
      {
        text: '步骤二',
        desc: '补充图书信息'
      },
      {
        text: '步骤三',
        desc: '发布成功'
      },
    ],
    show_scan:true,
    show_detail: false,
    show_success:false,
     selling:0,
     bookinfo:'',
    text:"为防止发布假冒伪劣信息，以上内容禁止修改！！！"
  },
onLoad(){
console.log(app.globalData)
},

//判读是否注册
  check_scan() {
    if (app.globalData.haved) {
      this.scan();
    } else {
      Dialog.confirm({
        title: '错误提示',
        message: '您还未补全信息，暂无法发布消息，赶快去填写吧~',
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

  //扫描
  scan() {
    var that = this;
    wx.scanCode({
      onlyFromCamera: true,
      scanType: ['barCode'],
      success: res => {
        var isbn = res.result;
        wx.showLoading({
          title: '处理中',
        })
         //先检查是否存在该书记录，没有再进行云函数调用
        db.collection('books').where({
         isbn:isbn
        }).get({
          success (res) {
            //添加到数据库
             if(res.data==""){
               
              wx.cloud.callFunction({
                name: 'bookinfo',
                data: {
                  isbn: isbn
                },
                success: res => {
                 var bookString = res.result;
                  var bookinfo = JSON.parse(bookString).result;
                  var pic = bookinfo.pic;
                  var pic = pic.replace('http','https');
                  bookinfo.pic = pic;
                  db.collection('books').add({
                    data: bookinfo,
                  }).then(res => {
                    that.setData({
                      show_scan: false,
                      show_detail: true,
                      show_success: false,
                      bookinfo: bookinfo,
                      active: 1,
                    })
                    wx.hideLoading();
                  }).catch(err => {
                    console.log(err)
                  })
                },
                fail: err => {
                  console.error(err)
                }
              })
            }else{
              that.setData({
                show_scan: false,
                show_detail:true,
                show_success: false,
                bookinfo:res.data[0],
                active: 1,
              });
               wx.hideLoading();
            }
          }
        })
      },
      fail: err => {
        Toast.fail('识别失败');
      }
    })
  },
//售价
selling(e){
  this.data.selling = e.detail;
  console.log(e.detail);
},
//补充说明
message(e){
  this.data.message = e.detail;
  console.log(e.detail);
},
confirm(){
  var that = this;
  wx.showModal({
    title: '发布确认',
    content: '您确认将以' + that.data.selling + '元转让《' + that.data.bookinfo.title + '》吗？',
    confirmText	:'发布',
    confirmColor:'#fbbd08',
    success(res) {
      if (res.confirm) {
        that.submit();
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    }
  })
},
//发布
submit(){
  var that = this;
  var timestamp = new Date().getTime();
  var boo= that.data.bookinfo;

  db.collection('sell').add({
    data: {
      timestamp: timestamp,
      day:common.nowDay(),
      onsell:'on',
      selling: that.data.selling,
      message: that.data.message,
      bookinfo:{
       title:boo.title,
       author:boo.author,
       edition: boo.edition,
       pic: boo.pic,
       price: boo.price,
       pubdate: boo.pubdate,
       publisher: boo.publisher,
       summary: boo.summary,  
        },
      key: boo.title + boo.edition + boo.keyword
    },
    complete() {
     that.setData({
       show_scan: false,
       show_detail: false,
       show_success:true,
       active: 2,
     })
    },
  })
},
again(){
  this.setData({
    bookinfo:''
  });
  this.scan();
},
onshow(){
  wx.navigateTo({
    url: '/pages/onshow/onshow',
  })
}

})