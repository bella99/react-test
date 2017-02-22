var languages = {
  "200001": {
    "zh_CN": "分钟前 ",
    "en": "minute ago "
  },
  "200002": {
    "zh_CN": "分钟前 ",
    "en": "minutes ago "
  },
  "200003": {
    "zh_CN": "小时前 ",
    "en": "hour ago "
  },
  "200004": {
    "zh_CN": "小时前 ",
    "en": "hours ago "
  },
  "200005": {
    "zh_CN": "天前 ",
    "en": "day ago "
  },
  "200006": {
    "zh_CN": "天前 ",
    "en": "days ago "
  },
  "200007": {
    "zh_CN": "月前 ",
    "en": "month ago "
  },
  "200008": {
    "zh_CN": "月前 ",
    "en": "months ago "
  },
  "200009": {
    "zh_CN": "年前 ",
    "en": "year ago "
  },
  "200010": {
    "zh_CN": "年前 ",
    "en": "years ago "
  },
  "200101": {
    "zh_CN": "话题",
    "en": "Posts"
  },
  "200102": {
    "zh_CN": "今日",
    "en": "Today"
  },
  "200103": {
    "zh_CN": "会员",
    "en": "Members"
  },
  "200104": {
    "zh_CN": "全部图片",
    "en": "All Photos"
  },
  "200105": {
    "zh_CN": "全部视频",
    "en": "All Videos"
  },
  "200106": {
    "zh_CN": "官方",
    "en": "Admin"
  },
  "200107": {
    "zh_CN": "版主",
    "en": "Moderator"
  },
  "200201": {
    "zh_CN": "活跃时间",
    "en": "Last Reply"
  },
  "200202": {
    "zh_CN": "创建时间",
    "en": "Created"
  },
  "200203": {
    "zh_CN": "浏览次数",
    "en": "Most Viewed"
  },
  "200204": {
    "zh_CN": "回复数量",
    "en": "Most Reply"
  },
  "201001": {
    "zh_CN": "影响力",
    "en": "Influencer"
  },
  "201002": {
    "zh_CN": "专题",
    "en": "Collections"
  },
  "201003": {
    "zh_CN": "活跃",
    "en": "Rising"
  },
  "201004": {
    "zh_CN": "投票",
    "en": "Poll"
  },
  "201005": {
    "zh_CN": "视频",
    "en": "Videos"
  },
  "201006": {
    "zh_CN": "图片",
    "en": "Photos"
  },
  "201007": {
    "zh_CN": "更多...",
    "en": "Read More"
  },
  "201008": {
    "zh_CN": "【图片】",
    "en": "[Photo]"
  },
  "202001": {
    "zh_CN": "点赞",
    "en": "Likes"
  },
  "202002": {
    "zh_CN": "回复",
    "en": "Replies"
  },
  "202003": {
    "zh_CN": "收藏",
    "en": "Favorites"
  },
  "202004": {
    "zh_CN": "浏览",
    "en": "Views"
  },
  "202101": {
    "zh_CN": "进行中",
    "en": "Running"
  },
  "202102": {
    "zh_CN": "已结束",
    "en": "Ended"
  },
  "202103": {
    "zh_CN": "人参与",
    "en": "Members Polled"
  },
  "202104": {
    "zh_CN": "下载",
    "en": "Get it"
  },
  "202105": {
    "zh_CN": "立即下载",
    "en": "Get it Now!"
  },
  "202106": {
    "zh_CN": "或者扫描下面二维码",
    "en": "or scan QR code below"
  },
  "202107": {
    "zh_CN": "搜索结果",
    "en": "Search Results"
  }
};

class Language {
    constructor() {
        var currentLang = navigator.language;
        if(!currentLang)
            currentLang = navigator.browserLanguage;
        if(!currentLang)
            currentLang = 'en';
        else
            currentLang = currentLang.split('.')[0];

        var full1 = currentLang.replace('_', '-');
        var full2 = currentLang.replace('-', '_');

        this.langCode = {
            short: currentLang.split(/[-_]/)[0],
            full1: currentLang.replace('_', '-'),
            full2: currentLang.replace('-', '_')
        };
    }

    getLangs() {
        return [
            this.langCode.full1,
            this.langCode.full2,
            this.langCode.short
        ];
    }

    getText(code) {
        var item = languages[code];
        if(!item)
            return "";

        var text = item[this.langCode.full1];
        if(!text)
            text = item[this.langCode.full2];
        if(!text)
            text = item[this.langCode.short];
        if(!text && this.langCode.short != 'en')
            text = item['en'];

        return text || "";
    }
}

export default new Language();
