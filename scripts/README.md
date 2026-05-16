# 测试数据插入脚本

## 快速开始

### 方式1：使用 Node.js 脚本（推荐）

1. 确保后端服务已启动：
   ```bash
   cd judengyoupin-backend
   npm run dev
   ```

2. 在另一个终端执行脚本：
   ```bash
   # 使用默认公司ID (545)
   node scripts/insert-test-data.mjs

   # 或指定公司ID
   node scripts/insert-test-data.mjs 545
   ```

### 方式2：使用测试页面

1. 启动后端服务：
   ```bash
   cd judengyoupin-backend
   npm run dev
   ```

2. 访问测试页面：
   ```
   http://localhost:3000/api-test/insert-test-data
   ```

3. 输入公司ID（默认545），点击"一键插入所有测试数据"

### 方式3：直接调用 API

```bash
curl -X POST http://localhost:3000/api/test-data/insert \
  -H "Content-Type: application/json" \
  -d '{"companyId": 545}'
```

## 插入的数据内容

### 1. 默认公司ID配置
- 配置名：`default_company_id`
- 值：指定的公司ID
- 用途：小程序启动时自动读取

### 2. 轮播图数据
- **顶部轮播图**：4个（使用 Unsplash 真实图片）
  - 春季新品大促
  - 限时特惠活动
  - 精选好物推荐
  - 会员专享优惠
- **底部轮播图**：2个
  - 品牌合作伙伴
  - 品质保证

### 3. 分类数据
- **主分类**（3个）：
  1. 家居用品
  2. 食品饮料
  3. 电子产品

- **子分类**（每个主分类5个）：
  - **家居用品**：沙发、床具、桌椅、柜子、装饰
  - **食品饮料**：休闲零食、饮料、生鲜食品、调味品、保健食品
  - **电子产品**：手机、电脑、家电、配件、智能设备

## 注意事项

1. **重复执行**：脚本使用 `on_conflict` 处理，可以安全地重复执行
2. **公司ID**：如果指定的公司ID不存在，部分操作可能会失败
3. **图片URL**：当前使用 Unsplash 占位图，生产环境需要替换为真实图片
4. **数据清理**：如需清理测试数据，请手动在数据库中删除

## 环境变量

可以通过环境变量自定义 API 地址：

```bash
API_URL=http://localhost:3000 node scripts/insert-test-data.mjs
```
