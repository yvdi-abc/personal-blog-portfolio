const siteConfig = {
  title: "Yvdiの小窝",
  authorName: "Yvdi",
  navTitle: "Yvdiの小窝",
  navSuffix: ".",
  bio: "在校大学生|业余开发者",
  avatarUrl: "/avatar.jpg",
  faviconUrl: "/favicon.ico",
  defaultPostCover: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1000&auto=format&fit=crop",
  photoWallImage: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1000&auto=format&fit=crop",
  themeColors: ["#667eea", "#764ba2", "#f093fb", "#4facfe", "#43e97b"],

  // 背景图片轮播
  useGradient: false,
  bgImages: [
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&h=1080&fit=crop",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&h=1080&fit=crop"
  ],

  // 音乐配置
  musicServer: "netease",  // 音乐平台：netease（网易云）
  musicIds: [  // 音乐 ID 列表
    "1809646618",   // 云月谣 - 兰音Reine
    "2755332551",   // DAMIDAMI - Sihan/三Z-STUDIO/HOYO-MiX (《绝区零》卢西娅EP)
    "2155422573",   // 使一颗心免于哀伤 - 知更鸟/HOYO-MiX/Chevy (崩坏：星穹铁道)
    "2618046004",   // 红透晚烟青 - 金玟岐/三Z-STUDIO/HOYO-MiX (《绝区零》青衣EP)
    "1818031620",   // 让风告诉你 - 花玲/喵☆酱/宴宁/kinsen (《原神》2021拜年纪同人曲)
    "2750140001",   // 提瓦特民谣 - 宴宁/XY大甘蔗等 (《原神》五周年同人曲)
    "2014336709",   // 我不曾忘记 - 花玲/张安琪/沐霏 (《原神》2023新春会同人曲)
    "2711809790",   // 不及 - 苏诗丁/三Z-STUDIO/HOYO-MiX (《绝区零》仪玄EP)
    "2155423468",   // 希望有羽毛和翅膀 - 知更鸟/HOYO-MiX/Chevy (崩坏：星穹铁道)
    "2671812705",   // 反乌托邦 - 乌托邦P
    "1375725396",   // Cyberangel - Hanser (IP动画短片《天使重构》主题曲)
    "3396545503",   // Amore - ReoNa (TV动画《与你相恋到生命尽头》片头曲)
    "3351427829",   // Penny-打火机 (哈基米南北绿豆) - Jovin (翻唱版)
    "3368687705",   // 哈基米南北绿豆 - 明宇
  ],

  social: {
    github: "https://github.com/yvdi-abc",
    gitee: "",
    google: "",
    email: "3625607718@qq.com",
    qq: "",
    wechat: "",
  },

  // 碎语（Chatter）配置
  chatterTitle: "碎语广场",
  chatterDescription: "记录生活的点点滴滴",

  // 全局背景弹幕配置
  danmakuList: [
    "在干嘛呢？",
    "欢迎来到我的小站~",
    "今天学习了吗？",
    "代码写得怎么样了？",
    "前方高能反应！",
    "摸鱼中...",
    "又在调 bug 吗？",
    "Tailwind CSS 真香",
    "Next.js 真好用",
    "React 19 来了！",
  ],

  // Gitalk 评论系统配置
  gitalkConfig: {
    clientID: process.env.NEXT_PUBLIC_GITALK_CLIENT_ID || "",  // GitHub OAuth App Client ID
    clientSecret: process.env.NEXT_PUBLIC_GITALK_CLIENT_SECRET || "",  // GitHub OAuth App Client Secret
    repo: "blog-comments",  // 存储评论的 GitHub 仓库名
    owner: "yvdi-abc",  // GitHub 用户名
    admin: ["yvdi-abc"],  // 管理员用户名数组
  },

  // AI 助手配置（可选：Gemini、OpenAI 等）
  geminiConfig: {
    modelId: "gemini-2.0-flash-exp",  // Gemini 模型 ID
    systemPrompt: `你是一个友好、聪明、有点幽默的 AI 助手。
你的主人是一个喜欢编程的学生开发者。
你说话的特点是：
1. 简短明了，每次最多两三句话
2. 偶尔会开玩笑或使用表情符号
3. 回复字数最多不超过 150 字
4. 乐于帮助解答技术问题`,
    maxOutputTokens: 200,
    temperature: 0.85,
  },

  // 友链申请格式
  friendLinkApplyFormat: `名称：Yvdiの小窝
简介：在校大学生|业余开发者
链接：https://your-domain.com
头像：https://your-avatar-url.jpg`,

  // 统计数据
  counts: {
    photos: 0,  // 照片墙数量
  },

  buildDate: "2026-07-30T00:00:00",  // 建站日期
  footerBadges: [
    {
      name: "Next.js 15",
      color: "text-sky-500",
      svg: "<path d=\"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z\"/>"
    },
    {
      name: "React 19",
      color: "text-cyan-400",
      svg: "<path d=\"M12 22.6l-9.8-5.6V5.6L12 0l9.8 5.6v11.4l-9.8 5.6zm-8.2-6.5l8.2 4.7 8.2-4.7V7.5L12 2.8 3.8 7.5v8.6z\"/>"
    },
    {
      name: "Tailwind 4",
      color: "text-teal-400",
      svg: "<path d=\"M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624C13.666,10.618,15.027,12,18.001,12 c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624c1.177,1.194,2.538,2.576,5.512,2.576 c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624C10.337,13.382,8.976,12,6.001,12z\"/>"
    }
  ],
  icpConfig: {
    name: "萌ICP备 20260240号",
    link: "https://icp.gov.moe/?keyword=20260240"
  },

  // 功能开关
  enableLevelSystem: false,  // 是否启用等级系统
};

export default siteConfig;
