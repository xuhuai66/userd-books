var app = getApp();
Page({


    data: {
      activeName: '1',
      car_list: [{
        title: '该程序是做什么的？',
        content: '本程序主要是方便重庆大学的朋友发布自己不要了的二手书的，如果您是其它学校的同学，可以访问【关于程序】页面，跟据说明，给自己学校也部署一个',
        key: '1'
      },
      {
        title: '该程序收费吗？',
        content: '本程序是完全的公益项目，永久承诺不收取任何中介费，您可以随心所欲的发布自己的书籍',
        key: '2'
      },
      {
        title: '为什么要留下联系方式？',
        content: '之所以未采取其它形式的交换方式，而使用原始的私下联系协商，最主要的目的是让买卖双方能互相熟识一下，扩大交友范围，增加同学之情',
        key: '3'
      },
        {
          title: '关于获取到的隐私会泄露吗？',
          content: '我们只录取到您的联系方式，除此之外，不会对您的姓名和身份证之类信息进行收集，所以不必担心隐私泄露问题',
          key: '4'
        },
        {
          title: '书籍卖掉之后忘记下架有什么后果？',
          content: '我们给用户只展示最近三十天内的发布情况，逾期后的将默认为下架状态，如果您的在售被三人投诉不实（书籍已售或其它不实信息），我们将采取永久封禁您的账号资格。',
          key: '5'
        },
      {
        title: '使用中出现问题怎么办？',
        content: '请点击底部的【反馈报错】，及时向咋们的开发者反馈消息',
        key: '6'
      }]
    },
  

  onChange(event) {
    this.setData({
      activeName: event.detail
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