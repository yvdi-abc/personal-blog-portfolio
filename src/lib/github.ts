/**
 * GitHub API 工具类
 * 用于在生产环境中通过 GitHub API 修改仓库文件
 */

interface GitHubConfig {
  owner: string;
  repo: string;
  token: string;
  branch: string;
}

export class GitHubClient {
  private config: GitHubConfig;
  private baseUrl = 'https://api.github.com';

  constructor(config: GitHubConfig) {
    this.config = config;
  }

  /**
   * 获取文件内容和 SHA
   */
  async getFile(path: string): Promise<{ content: string; sha: string }> {
    const url = `${this.baseUrl}/repos/${this.config.owner}/${this.config.repo}/contents/${path}?ref=${this.config.branch}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `token ${this.config.token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get file: ${response.statusText}`);
    }

    const data = await response.json();
    const content = Buffer.from(data.content, 'base64').toString('utf-8');

    return {
      content,
      sha: data.sha,
    };
  }

  /**
   * 更新文件内容
   */
  async updateFile(
    path: string,
    content: string,
    message: string,
    sha: string
  ): Promise<void> {
    const url = `${this.baseUrl}/repos/${this.config.owner}/${this.config.repo}/contents/${path}`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${this.config.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        content: Buffer.from(content).toString('base64'),
        sha,
        branch: this.config.branch,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to update file: ${error}`);
    }
  }

  /**
   * 创建新文件
   */
  async createFile(
    path: string,
    content: string,
    message: string
  ): Promise<void> {
    const url = `${this.baseUrl}/repos/${this.config.owner}/${this.config.repo}/contents/${path}`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${this.config.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        content: Buffer.from(content).toString('base64'),
        branch: this.config.branch,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to create file: ${error}`);
    }
  }
}

/**
 * 获取 GitHub 客户端实例
 */
export function getGitHubClient(): GitHubClient | null {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const token = process.env.GITHUB_TOKEN;
  const branch = process.env.GITHUB_BRANCH || 'main';

  // 在本地环境或未配置时返回 null
  if (!owner || !repo || !token) {
    return null;
  }

  return new GitHubClient({ owner, repo, token, branch });
}
