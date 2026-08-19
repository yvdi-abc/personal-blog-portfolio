export interface Post {
  slug: string;
  title: string;
  description: string;
  date: string;
  content: string;
  tags?: string[];
  cover?: string;
}

export interface Project {
  name: string;
  desc: string;
  tags: string[];
  icon: string;
  link?: string;
}

export const projectsData: Project[] = [
  { name: 'AstrBot 人格切换插件', desc: 'AstrBot 的人格切换插件，支持多个预设人格快速切换，让 AI 助手拥有不同的对话风格和性格特征。', tags: ['Python', 'AstrBot', 'Plugin'], icon: '🎭', link: 'https://github.com/yvdi-abc/astrbot_plugin_persona_switch' },
  { name: 'AstrBot 词汇过滤插件', desc: 'AstrBot 的智能词汇过滤插件，支持敏感词检测、自动屏蔽、自定义词库管理，保护聊天环境安全健康。', tags: ['Python', 'AstrBot', 'Plugin'], icon: '🛡️', link: 'https://github.com/yvdi-abc/astrbot_plugin_word_filter' },
  { name: 'AstrBot 聊天增强插件', desc: 'AstrBot 的聊天体验增强插件，提供智能回复优化、上下文记忆、情感分析等功能，让对话更自然流畅。', tags: ['Python', 'AstrBot', 'Plugin'], icon: '💬', link: 'https://github.com/yvdi-abc/astrbot_plugin_chat_enhancer' },
  { name: '个人博客作品集', desc: '基于 Next.js 15 + TypeScript 构建的现代化个人博客网站，支持博客、碎语、项目展示、友链等功能，集成 Gitalk 评论、AI 助手、音乐播放器等特色功能。', tags: ['Next.js', 'TypeScript', 'React'], icon: '🌐', link: 'https://github.com/yvdi-abc/personal-blog-portfolio' },
];
