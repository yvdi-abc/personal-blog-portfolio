/**
 * 网站配置类型定义
 */

export interface Author {
  name: string;
}

export interface SocialLinks {
  email: string;
  github: string;
}

export interface IcpConfig {
  name: string;
  link: string;
}

export interface GeminiConfig {
  modelId: string;
  systemPrompt: string;
  maxOutputTokens: number;
  temperature: number;
}

export interface GitalkConfig {
  clientID: string;
  clientSecret: string;
  repo: string;
  owner: string;
  admin: string[];
}

export interface FooterBadge {
  name: string;
  color: string;
  svg: string;
}

export interface SiteConfig {
  title: string;
  author: Author;
  navTitle: string;
  bio: string;
  avatarUrl: string;
  social: SocialLinks;
  musicIds: string[];
  danmakuList: string[];
  buildDate: string;
  icpConfig: IcpConfig;
  geminiConfig: GeminiConfig;
  gitalkConfig: GitalkConfig;
  defaultPostCover: string;
  footerBadges: FooterBadge[];
}
