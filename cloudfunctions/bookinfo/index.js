var rp = require('request-promise')

exports.main = (event, context) => {
  var res = rp('https://api.jisuapi.com/isbn/query?appkey={你的申请的key}&isbn=' + event.isbn).then(html => {
    return html;
  }).catch(err => {
    console.log(err);
  })
  return res;
}