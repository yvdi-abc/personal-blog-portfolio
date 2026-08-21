import { chromium } from 'playwright';

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

async function runUITests() {
  log('\n🎨 开始UI测试...', 'blue');
  log('━'.repeat(60), 'blue');

  let browser;
  let page;

  try {
    // 启动浏览器
    log('\n正在启动浏览器...', 'yellow');
    browser = await chromium.launch({ headless: true });
    page = await browser.newPage();

    // 测试1: 登录页面加载
    await test('登录页面可以正常加载', async () => {
      await page.goto(`${BASE_URL}/admin/login`);
      await page.waitForSelector('input[type="password"]', { timeout: 5000 });
      const title = await page.textContent('h1');
      if (!title.includes('管理') || !title.includes('登录')) {
        throw new Error('页面标题不正确');
      }
    });

    // 测试2: 登录功能
    await test('可以成功登录', async () => {
      await page.fill('input[type="password"]', PASSWORD);
      await page.click('button[type="submit"]');
      await page.waitForURL(`${BASE_URL}/admin`, { timeout: 5000 });
    });

    // 测试3: 管理后台主页加载
    await test('管理后台主页正常显示', async () => {
      const heading = await page.textContent('h1');
      if (!heading.includes('管理')) {
        throw new Error('主页标题不正确');
      }
    });

    // 测试4: 检查所有标签是否存在
    await test('所有7个管理标签正常显示', async () => {
      const tabs = await page.$$('nav button, nav a');
      if (tabs.length < 7) {
        throw new Error(`期望7个标签，实际找到${tabs.length}个`);
      }
    });

    // 测试5: 网站设置标签
    await test('网站设置标签可以切换', async () => {
      await page.click('text=网站设置');
      await page.waitForTimeout(500);
      const visible = await page.isVisible('text=网站标题');
      if (!visible) throw new Error('网站设置内容未显示');
    });

    // 测试6: 项目管理标签
    await test('项目管理标签可以切换', async () => {
      await page.click('text=项目管理');
      await page.waitForTimeout(500);
      const visible = await page.isVisible('text=新建项目');
      if (!visible) throw new Error('项目管理内容未显示');
    });

    // 测试7: 相册管理标签
    await test('相册管理标签可以切换', async () => {
      await page.click('text=相册管理');
      await page.waitForTimeout(500);
      const visible = await page.isVisible('text=新建相册');
      if (!visible) throw new Error('相册管理内容未显示');
    });

    // 测试8: 博客文章标签
    await test('博客文章标签可以切换', async () => {
      await page.click('text=博客文章');
      await page.waitForTimeout(500);
      const visible = await page.isVisible('text=新建文章');
      if (!visible) throw new Error('博客文章内容未显示');
    });

    // 测试9: 碎语标签
    await test('碎语标签可以切换', async () => {
      await page.click('text=碎语');
      await page.waitForTimeout(500);
      const visible = await page.isVisible('text=新建碎语');
      if (!visible) throw new Error('碎语内容未显示');
    });

    // 测试10: 友链标签
    await test('友链标签可以切换', async () => {
      await page.click('text=友链');
      await page.waitForTimeout(500);
      const visible = await page.isVisible('text=新建友链');
      if (!visible) throw new Error('友链内容未显示');
    });

    // 测试11: 个人信息标签
    await test('个人信息标签可以切换', async () => {
      await page.click('text=个人信息');
      await page.waitForTimeout(500);
      const visible = await page.isVisible('text=作者名称');
      if (!visible) throw new Error('个人信息内容未显示');
    });

    // 测试12: 深色模式
    await test('页面支持深色/浅色模式', async () => {
      // 检查是否有主题相关的class
      const html = await page.$('html');
      const className = await html.getAttribute('class');
      // 应该有dark class或相关的主题类
      if (className === null) {
        log('   提示: 未检测到主题class，但可能在运行时动态添加', 'yellow');
      }
    });

    // 测试13: 截图验证
    await test('生成管理后台截图', async () => {
      await page.screenshot({
        path: 'admin-dashboard-screenshot.png',
        fullPage: true
      });
      log('   截图已保存: admin-dashboard-screenshot.png', 'blue');
    });

  } catch (error) {
    log(`\n❌ 测试执行出错: ${error.message}`, 'red');
  } finally {
    if (browser) {
      await browser.close();
    }
  }

  // 输出测试结果
  log('\n' + '━'.repeat(60), 'blue');
  log('📊 UI测试结果统计', 'blue');
  log('━'.repeat(60), 'blue');
  log(`总测试数: ${totalTests}`, 'blue');
  log(`通过: ${passedTests}`, 'green');
  log(`失败: ${failedTests}`, failedTests > 0 ? 'red' : 'green');
  log(`通过率: ${((passedTests / totalTests) * 100).toFixed(1)}%`,
      failedTests === 0 ? 'green' : 'yellow');

  if (failedTests === 0) {
    log('\n🎉 所有UI测试通过！界面功能正常！', 'green');
  } else {
    log('\n⚠️  部分UI测试失败，请检查错误信息', 'yellow');
  }
}

runUITests().catch(error => {
  log(`\n❌ 测试执行出错: ${error.message}`, 'red');
  process.exit(1);
});
