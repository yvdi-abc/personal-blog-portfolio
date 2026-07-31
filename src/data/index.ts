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
  { name: 'CloudViz', desc: '基于 D3.js + WebSocket 的实时监控看板，支持自定义布局与毫秒级数据刷新。', tags: ['React', 'D3.js', 'WebSocket'], icon: '📊' },
  { name: 'BlogEngine', desc: '轻量级静态博客生成器，支持 Markdown 编写、自定义主题、全文搜索与 RSS。', tags: ['Node.js', 'Markdown', 'CLI'], icon: '✍️' },
  { name: 'EcoTrack', desc: '个人碳足迹追踪 App，通过消费数据计算碳排放，提供可视化报告与减排建议。', tags: ['React Native', 'Firebase', 'Charts'], icon: '🌱' },
  { name: 'UI·KIT', desc: '60+ 基础组件的设计系统，支持 Figma 与 Storybook 双向同步，统一 Token 体系。', tags: ['Figma', 'Storybook', 'CSS'], icon: '🎨' },
];
