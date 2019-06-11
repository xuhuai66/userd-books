import Toast from '../../dist/toast/toast';
var common = require("../../common.js");
var db = wx.cloud.database();
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    campus_a: ['重大C区', '重大B区', '重大A区', '虎溪校区'],
    show: false,
    overlay:true,
    campus:'重大A区',
    kind: '微信',
    error_contact:'',
    contact:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onClose() {
    this.setData({ show: false });
  },
  onChange(event) {
    const { value, index } = event.detail;
  },

  onConfirm(event) {
    const { value, index } = event.detail;
   this.setData({ 
     campus:value ,
     show: false,
      });
  },

  onCancel() {
this.onClose();
  },
  in_campus(){
    this.setData({
      show: true,
    })
  },
  onChange_radio(event) {
    this.setData({
      checked: event.detail
    });
  },
  onClick(event) {
    const { name } = event.currentTarget.dataset;
    this.setData({
      kind: name
    });
  },
  //获取输入号码
  contact(e){
    this.data.contact = e.detail;
  },
  //获取用户信息
  getuser(e){
    var that = this;
    var test = e.detail.errMsg.indexOf("ok");
    if (test=='-1'){
      Toast('请确认授权后方可使用~');
    }else{
    that.setData({
      userInfo:e.detail.userInfo
    })
  that.check();
    }
  },
  //校检
  check(){
    var that = this;
    var kind = that.data.kind;
    var contact = that.data.contact;
    switch(kind){
      case '微信':
         if (!(/^[a-zA-Z]([-_a-zA-Z0-9]{5,19})+$/.test(contact))) {
          that.setData({
            error_contact:'请输入正确的微信号'
           })
          return false;
         }
        that.save();
      break; 
      case 'QQ': 
         if (!(/^\s*[.0-9]{5,11}\s*$/.test(contact))) {
          that.setData({
             error_contact: '请输入正确的QQ号'
           })
          return false;
          }
        that.save();
          break; 
       case '手机':
          if (!(/^((\+?86)|(\+86))?1[0-9]{10}$/.test(contact))) {
           that.setData({
             error_contact: '请输入正确的手机号'
           })
            return false;
          }
        that.save();
          break; 
     }
  },
//保存用户信息
save(){
  var that = this;
  that.setData({error_contact: ''});
  db.collection('user').where({
    _openid: app.globalData.openid,
  }).get({
    success: function (res) {
     console.log(res.data)
     if(res.data==''){
       that.add();
     }else{
       var _id = res.data[0]._id;
       that.updata(_id);
     }
    }
  })
},
add(){
  var that = this;
  db.collection('user').add({
    data: {
      kind: that.data.kind,
      contact: that.data.contact,
      campus: that.data.campus,
      registed: common.nowTime(),
      avatarUrl: that.data.userInfo.avatarUrl,
      gender: that.data.userInfo.gender,
      nickName: that.data.userInfo.nickName,
      useful: true
    },
    success: function (res) {
      that.storage();
    },
    fail: console.error
  })
},

updata(e){
  var that = this;
  var _id = e;
  db.collection('user').doc(_id).update({
    data: {
      kind: that.data.kind+'号',
      contact: that.data.contact,
      campus: that.data.campus,
      avatarUrl: that.data.userInfo.avatarUrl,
      gender: that.data.userInfo.gender,
      nickName: that.data.userInfo.nickName,
    },
      success: function (res) {
        that.storage();
      },
      fail: console.error
    })
  },

storage(){
  var that = this;
    var userinfo = {
      _openid: app.globalData.openid,
      kind: that.data.kind + '号',
      contact: that.data.contact,
      campus: that.data.campus,
      registed: common.nowTime(),
      avatarUrl: that.data.userInfo.avatarUrl,
      gender: that.data.userInfo.gender,
      nickName: that.data.userInfo.nickName,
      useful: true
  };
  wx.setStorageSync('user' ,userinfo);
  app.globalData.haved = true;
  app.globalData.userinfo = userinfo;
   wx.navigateBack({
     delta: 1
   });
}
})