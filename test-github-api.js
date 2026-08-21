// 测试 GitHub API 配置
const GITHUB_OWNER = process.env.GITHUB_OWNER || 'yvdi-abc';
const GITHUB_REPO = process.env.GITHUB_REPO || 'personal-blog-portfolio';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

async function testGitHubAPI() {
  console.log('🔍 测试 GitHub API 配置...\n');
  
  if (!GITHUB_TOKEN) {
    console.log('❌ 未设置 GITHUB_TOKEN 环境变量');
    console.log('💡 这是正常的，因为是本地测试');
    console.log('✅ 线上 Vercel 需要配置这个变量\n');
    return;
  }

  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/src/siteConfig.ts?ref=${GITHUB_BRANCH}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ GitHub API 连接成功！');
      console.log(`📁 文件: ${data.name}`);
      console.log(`📏 大小: ${data.size} bytes`);
      console.log(`🔗 SHA: ${data.sha.substring(0, 7)}...\n`);
    } else {
      console.log('❌ GitHub API 请求失败');
      console.log(`状态码: ${response.status}`);
      console.log(`错误: ${await response.text()}\n`);
    }
  } catch (error) {
    console.log('❌ 请求出错:', error.message, '\n');
  }
}

testGitHubAPI();
