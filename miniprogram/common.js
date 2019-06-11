var post = function (url, data) {
  var promise = new Promise((resolve, reject) => {
    var that = this;
    var postData = data;
    wx.request({
      url: url,
      data: postData,
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        resolve(res);
      },
      error: function (e) {
        reject('网络出错');
      }
    })
  });
  return promise;
}
var get = function (url) {
  var promise = new Promise((resolve, reject) => {
    var that = this;
    wx.request({
      url: url,
      success: function (res) {
        resolve(res);
      },
      error: function (e) {
        reject('网络出错');
      }
    })
  });
  return promise;
}

var nowDay = function () {
  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var day = now.getDate();
 var date = month+'月'+day+'日';
  return date;
}
var nowTime = function () {
  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var day = now.getDate();
  var hour = now.getHours()
  var minute = now.getMinutes()
  var second = now.getSeconds()
  var date = year + "/" + month + "/" + day + " " + hour + ":" + minute + ":" + second;
  return date;
}

module.exports = {
  post: post,
  get: get,
  nowDay: nowDay,
  nowTime: nowTime
}