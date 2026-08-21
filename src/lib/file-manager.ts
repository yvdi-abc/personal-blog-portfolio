/**
 * 统一的文件操作接口
 * 自动根据环境选择本地文件系统或 GitHub API
 */
import fs from 'fs/promises';
import path from 'path';
import { getGitHubClient } from './github';

export class FileManager {
  private githubClient = getGitHubClient();
  private isProduction = !!this.githubClient;

  /**
   * 读取文件内容
   */
  async readFile(filePath: string): Promise<string> {
    if (this.isProduction && this.githubClient) {
      const result = await this.githubClient.getFile(filePath);
      return result.content;
    } else {
      const fullPath = path.join(process.cwd(), filePath);
      return await fs.readFile(fullPath, 'utf-8');
    }
  }

  /**
   * 写入文件内容
   */
  async writeFile(
    filePath: string,
    content: string,
    commitMessage?: string
  ): Promise<void> {
    if (this.isProduction && this.githubClient) {
      try {
        // 尝试获取现有文件的 SHA
        const { sha } = await this.githubClient.getFile(filePath);
        await this.githubClient.updateFile(
          filePath,
          content,
          commitMessage || `chore: update ${filePath} via admin panel`,
          sha
        );
      } catch {
        // 文件不存在，创建新文件
        await this.githubClient.createFile(
          filePath,
          content,
          commitMessage || `chore: create ${filePath} via admin panel`
        );
      }
    } else {
      const fullPath = path.join(process.cwd(), filePath);
      await fs.writeFile(fullPath, content, 'utf-8');
    }
  }

  /**
   * 检查文件是否存在
   */
  async fileExists(filePath: string): Promise<boolean> {
    try {
      await this.readFile(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 读取 JSON 文件
   */
  async readJSON<T>(filePath: string): Promise<T> {
    const content = await this.readFile(filePath);
    return JSON.parse(content);
  }

  /**
   * 写入 JSON 文件
   */
  async writeJSON<T>(
    filePath: string,
    data: T,
    commitMessage?: string
  ): Promise<void> {
    const content = JSON.stringify(data, null, 2);
    await this.writeFile(filePath, content, commitMessage);
  }

  /**
   * 是否在生产环境（使用 GitHub API）
   */
  isProductionMode(): boolean {
    return this.isProduction;
  }
}

// 导出单例
export const fileManager = new FileManager();
