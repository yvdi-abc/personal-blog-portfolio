const BASE_URL = 'http://localhost:3000';
const PASSWORD = 'pH7.0000';

// 颜色输出
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// 测试结果统计
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

async function test(name, fn) {
  totalTests++;
  try {
    await fn();
    passedTests++;
    log(`✅ ${name}`, 'green');
    return true;
  } catch (error) {
    failedTests++;
    log(`❌ ${name}`, 'red');
    log(`   错误: ${error.message}`, 'red');
    return false;
  }
}

// 1. 测试管理后台页面是否可访问
async function testAdminPageAccess() {
  await test('管理后台登录页面可访问', async () => {
    const response = await fetch(`${BASE_URL}/admin/login`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
  });
}

// 2. 测试登录API
async function testLoginAPI() {
  let sessionCookie = null;

  await test('登录API - 错误密码应该返回401', async () => {
    const response = await fetch(`${BASE_URL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'wrong_password' })
    });
    if (response.status !== 401) throw new Error(`期望401，实际${response.status}`);
  });

  await test('登录API - 正确密码应该返回200', async () => {
    const response = await fetch(`${BASE_URL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: PASSWORD })
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    // 保存session cookie
    const cookies = response.headers.get('set-cookie');
    if (cookies) {
      sessionCookie = cookies.split(';')[0];
    }
  });

  return sessionCookie;
}

// 3. 测试认证检查API
async function testAuthCheck(sessionCookie) {
  await test('未认证访问应该返回401', async () => {
    const response = await fetch(`${BASE_URL}/api/admin/check-auth`);
    const data = await response.json();
    if (data.authenticated !== false) throw new Error('应该返回未认证');
  });

  await test('已认证访问应该返回200', async () => {
    const response = await fetch(`${BASE_URL}/api/admin/check-auth`, {
      headers: { 'Cookie': sessionCookie }
    });
    const data = await response.json();
    if (data.authenticated !== true) throw new Error('应该返回已认证');
  });
}

// 4. 测试网站设置API
async function testSiteSettingsAPI(sessionCookie) {
  await test('读取网站设置', async () => {
    const response = await fetch(`${BASE_URL}/api/admin/site-settings`, {
      headers: { 'Cookie': sessionCookie }
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (!data.title) throw new Error('缺少title字段');
    if (!data.authorName) throw new Error('缺少authorName字段');
  });

  await test('保存网站设置 - 缺少必填字段应该返回400', async () => {
    const response = await fetch(`${BASE_URL}/api/admin/site-settings`, {
      method: 'POST',
      headers: {
        'Cookie': sessionCookie,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: '',
        authorName: '',
        navTitle: ''
      })
    });
    if (response.status !== 400) throw new Error(`期望400，实际${response.status}`);
  });
}

// 5. 测试项目管理API
async function testProjectsAPI(sessionCookie) {
  await test('读取项目列表', async () => {
    const response = await fetch(`${BASE_URL}/api/admin/projects`, {
      headers: { 'Cookie': sessionCookie }
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error('应该返回数组');
  });

  await test('保存项目数据', async () => {
    const response = await fetch(`${BASE_URL}/api/admin/projects`, {
      method: 'POST',
      headers: {
        'Cookie': sessionCookie,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([
        {
          name: '测试项目',
          desc: '这是一个测试项目',
          tags: ['Test', 'Demo'],
          icon: '🧪',
          link: 'https://test.com'
        }
      ])
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
  });
}

// 6. 测试相册管理API
async function testAlbumsAPI(sessionCookie) {
  await test('读取相册列表', async () => {
    const response = await fetch(`${BASE_URL}/api/admin/albums`, {
      headers: { 'Cookie': sessionCookie }
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error('应该返回数组');
  });

  await test('保存相册数据', async () => {
    const response = await fetch(`${BASE_URL}/api/admin/albums`, {
      method: 'POST',
      headers: {
        'Cookie': sessionCookie,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([
        {
          id: 'test-album',
          title: '测试相册',
          description: '这是一个测试相册',
          cover: 'https://example.com/cover.jpg',
          date: '2026',
          photos: [
            { url: 'https://example.com/photo1.jpg', caption: '照片1' }
          ]
        }
      ])
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
  });
}

// 7. 测试配置API
async function testConfigAPI(sessionCookie) {
  await test('读取配置', async () => {
    const response = await fetch(`${BASE_URL}/api/admin/config`, {
      headers: { 'Cookie': sessionCookie }
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (!data.config) throw new Error('缺少config字段');
  });
}

// 8. 测试友链API
async function testFriendsAPI(sessionCookie) {
  await test('读取友链列表', async () => {
    const response = await fetch(`${BASE_URL}/api/admin/friends`, {
      headers: { 'Cookie': sessionCookie }
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (!data.friends || !Array.isArray(data.friends)) throw new Error('应该返回 { friends: [] } 格式');
  });
}

// 9. 测试碎语API
async function testChattersAPI(sessionCookie) {
  await test('读取碎语列表', async () => {
    const response = await fetch(`${BASE_URL}/api/admin/chatters`, {
      headers: { 'Cookie': sessionCookie }
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (!data.chatters || !Array.isArray(data.chatters)) throw new Error('应该返回 { chatters: [] } 格式');
  });
}

// 10. 测试博客文章API
async function testPostsAPI(sessionCookie) {
  await test('读取博客文章列表', async () => {
    const response = await fetch(`${BASE_URL}/api/admin/posts`, {
      headers: { 'Cookie': sessionCookie }
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (!data.posts || !Array.isArray(data.posts)) throw new Error('应该返回 { posts: [] } 格式');
  });
}

// 主测试流程
async function runAllTests() {
  log('\n🚀 开始测试管理后台...', 'blue');
  log('━'.repeat(60), 'blue');

  log('\n📍 第1组：页面访问测试', 'yellow');
  await testAdminPageAccess();

  log('\n📍 第2组：登录功能测试', 'yellow');
  const sessionCookie = await testLoginAPI();

  if (!sessionCookie) {
    log('\n❌ 登录失败，无法继续后续测试', 'red');
    return;
  }

  log('\n📍 第3组：认证检查测试', 'yellow');
  await testAuthCheck(sessionCookie);

  log('\n📍 第4组：网站设置API测试', 'yellow');
  await testSiteSettingsAPI(sessionCookie);

  log('\n📍 第5组：项目管理API测试', 'yellow');
  await testProjectsAPI(sessionCookie);

  log('\n📍 第6组：相册管理API测试', 'yellow');
  await testAlbumsAPI(sessionCookie);

  log('\n📍 第7组：配置API测试', 'yellow');
  await testConfigAPI(sessionCookie);

  log('\n📍 第8组：友链API测试', 'yellow');
  await testFriendsAPI(sessionCookie);

  log('\n📍 第9组：碎语API测试', 'yellow');
  await testChattersAPI(sessionCookie);

  log('\n📍 第10组：博客文章API测试', 'yellow');
  await testPostsAPI(sessionCookie);

  // 输出测试结果
  log('\n' + '━'.repeat(60), 'blue');
  log('📊 测试结果统计', 'blue');
  log('━'.repeat(60), 'blue');
  log(`总测试数: ${totalTests}`, 'blue');
  log(`通过: ${passedTests}`, 'green');
  log(`失败: ${failedTests}`, failedTests > 0 ? 'red' : 'green');
  log(`通过率: ${((passedTests / totalTests) * 100).toFixed(1)}%`,
      failedTests === 0 ? 'green' : 'yellow');

  if (failedTests === 0) {
    log('\n🎉 所有测试通过！管理后台功能正常！', 'green');
  } else {
    log('\n⚠️  部分测试失败，请检查错误信息', 'yellow');
  }
}

// 运行测试
runAllTests().catch(error => {
  log(`\n❌ 测试执行出错: ${error.message}`, 'red');
  process.exit(1);
});
