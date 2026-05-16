/**
 * 直接执行测试数据插入脚本
 * 
 * 使用方法：
 * 1. 确保后端服务已启动
 * 2. 运行: node scripts/insert-test-data.mjs [companyId]
 * 
 * 示例：
 *   node scripts/insert-test-data.mjs 545
 *   node scripts/insert-test-data.mjs  # 使用默认值 545
 */

const API_URL = process.env.API_URL || 'http://localhost:3000';
const COMPANY_ID = process.argv[2] ? parseInt(process.argv[2]) : 545;

async function insertTestData() {
  try {
    console.log(`\n🚀 开始插入测试数据...`);
    console.log(`📦 公司ID: ${COMPANY_ID}`);
    console.log(`🌐 API地址: ${API_URL}\n`);

    const response = await fetch(`${API_URL}/api/test-data/insert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ companyId: COMPANY_ID }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();

    if (result.success) {
      console.log('✅ 测试数据插入成功！\n');
      console.log('📊 执行结果：');
      console.log(JSON.stringify(result.results, null, 2));
      
      // 显示摘要
      console.log('\n📋 数据摘要：');
      if (result.results.defaultCompanyIdConfig?.success) {
        console.log('  ✅ 默认公司ID配置已设置');
      }
      if (result.results.banners?.success) {
        console.log('  ✅ 轮播图数据已更新（顶部4个，底部2个）');
      }
      if (result.results.categories?.success) {
        console.log('  ✅ 主分类已插入（3个）');
        const categoryData = result.results.categories.data;
        if (categoryData) {
          console.log(`     - ${categoryData.category1?.name || 'N/A'}`);
          console.log(`     - ${categoryData.category2?.name || 'N/A'}`);
          console.log(`     - ${categoryData.category3?.name || 'N/A'}`);
        }
      }
      if (result.results.subCategories) {
        const successCount = result.results.subCategories.filter(
          (r) => r.success
        ).length;
        console.log(`  ✅ 子分类已插入（${successCount}个主分类，每个5个子分类）`);
      }
      
      console.log('\n🎉 所有测试数据已准备就绪！');
      console.log(`\n💡 提示：现在可以在小程序中查看效果了\n`);
    } else {
      console.error('❌ 插入失败:', result.message);
      if (result.error) {
        console.error('   错误详情:', result.error);
      }
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ 执行失败:', error.message);
    console.error('\n💡 请确保：');
    console.error('   1. 后端服务已启动（运行 npm run dev）');
    console.error('   2. API地址正确（默认: http://localhost:3000）');
    console.error('   3. 数据库连接正常\n');
    process.exit(1);
  }
}

// 检查 fetch 是否可用（Node.js 18+）
if (typeof fetch === 'undefined') {
  console.error('❌ 需要 Node.js 18+ 或安装 node-fetch');
  process.exit(1);
}

insertTestData();
