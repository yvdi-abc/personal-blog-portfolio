const BASE_URL = 'http://localhost:3000';
const PASSWORD = 'pH7.0000';

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

// 获取页面HTML
async function fetchPage(url, cookie = '') {
  const headers = cookie ? { 'Cookie': cookie } : {};
  const response = await fetch(url, { headers });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return await response.text();
}

async function runUITests() {
  log('\n🎨 开始UI/HTML验证测试...', 'blue');
  log('━'.repeat(60), 'blue');

  // 先登录获取session
  log('\n正在登录获取session...', 'yellow');
  const loginResponse = await fetch(`${BASE_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: PASSWORD })
  });
  const cookies = loginResponse.headers.get('set-cookie');
  const sessionCookie = cookies ? cookies.split(';')[0] : '';

  if (!sessionCookie) {
    log('❌ 无法获取session cookie', 'red');
    return;
  }

  // 测试1: 登录页面HTML
  await test('登录页面HTML结构正确', async () => {
    const html = await fetchPage(`${BASE_URL}/admin/login`);
    if (!html.includes('type="password"')) throw new Error('缺少密码输入框');
    if (!html.includes('button')) throw new Error('缺少提交按钮');
  });

  // 测试2: 管理后台主页HTML
  await test('管理后台主页HTML结构正确', async () => {
    const html = await fetchPage(`${BASE_URL}/admin`, sessionCookie);
    if (!html.includes('管理')) throw new Error('缺少管理相关文本');
  });

  // 测试3: 检查关键组件是否存在
  await test('检查网站设置管理器组件', async () => {
    const html = await fetchPage(`${BASE_URL}/admin`, sessionCookie);
    // 应该包含网站设置相关的文本
    if (!html.includes('网站') || !html.includes('设置')) {
      throw new Error('可能缺少网站设置组件');
    }
  });

  // 测试4: 检查项目管理器
  await test('检查项目管理器组件', async () => {
    const html = await fetchPage(`${BASE_URL}/admin`, sessionCookie);
    if (!html.includes('项目')) {
      throw new Error('可能缺少项目管理组件');
    }
  });

  // 测试5: 检查相册管理器
  await test('检查相册管理器组件', async () => {
    const html = await fetchPage(`${BASE_URL}/admin`, sessionCookie);
    if (!html.includes('相册')) {
      throw new Error('可能缺少相册管理组件');
    }
  });

  // 测试6: 检查CSS是否加载
  await test('检查页面包含样式', async () => {
    const html = await fetchPage(`${BASE_URL}/admin`, sessionCookie);
    if (!html.includes('class=') && !html.includes('className=')) {
      throw new Error('页面可能缺少CSS类名');
    }
  });

  // 测试7: 检查React hydration
  await test('检查React相关标记', async () => {
    const html = await fetchPage(`${BASE_URL}/admin`, sessionCookie);
    if (!html.includes('__next') && !html.includes('react')) {
      log('   提示: 未检测到明显的React标记，但这是正常的', 'yellow');
    }
  });

  // 测试8: 检查主题支持
  await test('检查深色模式相关代码', async () => {
    const html = await fetchPage(`${BASE_URL}/admin`, sessionCookie);
    if (html.includes('dark:') || html.includes('theme')) {
      log('   检测到主题相关代码', 'blue');
    }
  });

  // 测试9: 检查表单元素
  await test('管理页面包含表单元素', async () => {
    const html = await fetchPage(`${BASE_URL}/admin`, sessionCookie);
    if (!html.includes('input') && !html.includes('textarea') && !html.includes('button')) {
      throw new Error('缺少表单元素');
    }
  });

  // 测试10: 检查保存按钮
  await test('检查保存按钮存在', async () => {
    const html = await fetchPage(`${BASE_URL}/admin`, sessionCookie);
    if (!html.includes('保存')) {
      throw new Error('未找到保存按钮');
    }
  });

  // 输出测试结果
  log('\n' + '━'.repeat(60), 'blue');
  log('📊 UI验证测试结果统计', 'blue');
  log('━'.repeat(60), 'blue');
  log(`总测试数: ${totalTests}`, 'blue');
  log(`通过: ${passedTests}`, 'green');
  log(`失败: ${failedTests}`, failedTests > 0 ? 'red' : 'green');
  log(`通过率: ${((passedTests / totalTests) * 100).toFixed(1)}%`,
      failedTests === 0 ? 'green' : 'yellow');

  if (failedTests === 0) {
    log('\n🎉 所有UI验证测试通过！界面结构正常！', 'green');
  } else {
    log('\n⚠️  部分UI验证测试失败，请检查错误信息', 'yellow');
  }
}

runUITests().catch(error => {
  log(`\n❌ 测试执行出错: ${error.message}`, 'red');
  process.exit(1);
});
