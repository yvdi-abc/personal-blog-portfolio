# 部署指南

## 在线修改网站内容

部署到 Vercel 后，访问 `https://www.20071103.xyz/admin` 即可在线修改网站内容。

### 可修改的内容

1. **网站设置** - 标题、作者、简介、头像、社交链接、音乐、弹幕等
2. **博客文章** - 创建、编辑、删除文章
3. **碎语动态** - 发布碎语
4. **项目展示** - 管理项目列表
5. **友情链接** - 管理友链

## 配置步骤（必需）

### 1. 创建 GitHub Personal Access Token

1. 访问 [GitHub Settings - Tokens](https://github.com/settings/tokens)
2. 点击 **Generate new token** → **Generate new token (classic)**
3. 填写：
   - **Note**: `vercel-admin-panel`（备注名称随意）
   - **Expiration**: 选择 **No expiration**（或自定义过期时间）
   - **Select scopes**: 勾选 **repo**（完整仓库访问权限）
4. 点击 **Generate token**
5. **复制生成的 token**（格式：`ghp_xxxxxxxxxxxx`）⚠️ 只显示一次，请妥善保存

### 2. 在 Vercel 配置环境变量

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 进入你的项目
3. 点击 **Settings** → **Environment Variables**
4. 添加以下 4 个环境变量：

| Name | Value | 说明 |
|------|-------|------|
| `GITHUB_OWNER` | `yvdi-abc` | 你的 GitHub 用户名 |
| `GITHUB_REPO` | `personal-blog-portfolio` | 你的仓库名 |
| `GITHUB_TOKEN` | `ghp_xxxxxxxxxxxx` | 刚才创建的 token |
| `GITHUB_BRANCH` | `main` | 分支名（通常是 main） |

5. **Environment** 选择 **Production**（或 All）
6. 点击 **Save**

### 3. 重新部署

在 Vercel Dashboard 点击 **Deployments** → 最新部署 → **Redeploy**

## 完成！

现在访问 `https://www.20071103.xyz/admin` 就可以在线修改内容了：

- **修改网站配置**：保存后会自动提交到 GitHub，触发 Vercel 重新部署（1-2 分钟生效）
- **修改文章/碎语/项目/友链**：保存后立即生效（无需重新部署）

## 工作原理

```
管理后台 → GitHub API → 更新仓库文件 → Vercel 自动检测变化 → 重新部署
```

## 本地开发

本地开发时不需要配置环境变量，直接运行：

```bash
npm run dev
```

访问 http://localhost:3000/admin 进行测试，修改会直接写入本地文件。

## 安全提示

⚠️ **请勿泄露 GitHub Token**：
- 不要将 token 提交到代码仓库
- 不要在公开场合分享
- 定期更换 token
- 如果泄露，立即在 GitHub 删除该 token 并重新生成

## 故障排查

### 修改后没有生效？
1. 检查 Vercel 环境变量是否配置正确
2. 查看 Vercel 部署日志是否有错误
3. 确认 GitHub Token 权限包含 `repo`

### GitHub API 报错？
- 检查 token 是否过期
- 确认仓库名和用户名是否正确
- 查看 Vercel Function Logs 获取详细错误信息
