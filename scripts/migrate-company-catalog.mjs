/**
 * 将某公司的分类、商品（含 SKU）、套餐迁移到另一公司（修改 company_companies 归属）
 *
 * 用法：
 *   node scripts/migrate-company-catalog.mjs <源公司ID> <目标公司ID> [选项]
 *
 * 示例：
 *   node scripts/migrate-company-catalog.mjs 123 545 --dry-run
 *   node scripts/migrate-company-catalog.mjs 123 545 --yes
 *
 * 选项：
 *   --dry-run    仅统计将迁移的数据量，不写入
 *   --yes        跳过确认，直接执行
 *   --endpoint   Hasura GraphQL 地址（默认读 goc.config.ts 或 HASURA_ENDPOINT）
 *   --secret     Hasura Admin Secret（默认读 goc.config.ts 或 HASURA_ADMIN_SECRET）
 *
 * 环境变量（可选，覆盖 goc.config.ts）：
 *   HASURA_ENDPOINT
 *   HASURA_ADMIN_SECRET
 */

import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { createInterface } from "readline";

const __dirname = dirname(fileURLToPath(import.meta.url));

function parseArgs(argv) {
  const positional = [];
  const flags = {
    dryRun: false,
    yes: false,
    endpoint: null,
    secret: null,
  };

  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--dry-run") flags.dryRun = true;
    else if (arg === "--yes" || arg === "-y") flags.yes = true;
    else if (arg === "--endpoint") flags.endpoint = argv[++i];
    else if (arg === "--secret") flags.secret = argv[++i];
    else if (arg === "--help" || arg === "-h") flags.help = true;
    else if (arg.startsWith("-")) {
      throw new Error(`未知选项: ${arg}`);
    } else {
      positional.push(arg);
    }
  }

  return { positional, flags };
}

function printHelp() {
  console.log(`
公司商品库迁移脚本

用法:
  node scripts/migrate-company-catalog.mjs <源公司ID> <目标公司ID> [选项]

迁移范围（按顺序）:
  1. categories（未删除）
  2. products（未删除）
  3. product_skus（未删除）
  4. packages
  5. company_products（冲突行会先删除源公司侧重复关联）
  6. company_packages（同上）

选项:
  --dry-run       仅预览数量
  --yes, -y       跳过确认
  --endpoint URL  Hasura 端点
  --secret SECRET Hasura Admin Secret
`);
}

function loadGocConfig() {
  const configPath = join(__dirname, "..", "goc.config.ts");
  let endpoint = process.env.HASURA_ENDPOINT;
  let secret = process.env.HASURA_ADMIN_SECRET;

  try {
    const content = readFileSync(configPath, "utf8");
    if (!endpoint) {
      const m = content.match(/endpoint:\s*["']([^"']+)["']/);
      if (m) endpoint = m[1];
    }
    if (!secret) {
      const m = content.match(/["']x-hasura-admin-secret["']:\s*["']([^"']+)["']/);
      if (m) secret = m[1];
    }
  } catch {
    // goc.config.ts 不存在时仅依赖环境变量
  }

  return { endpoint, secret };
}

async function gql(endpoint, secret, query, variables = {}) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-hasura-admin-secret": secret,
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${JSON.stringify(json)}`);
  }
  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join("; "));
  }
  return json.data;
}

async function confirm(message) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await new Promise((resolve) => {
    rl.question(`${message} (yes/no): `, resolve);
  });
  rl.close();
  return answer.trim().toLowerCase() === "yes" || answer.trim().toLowerCase() === "y";
}

async function fetchCompany(endpoint, secret, id) {
  const data = await gql(
    endpoint,
    secret,
    `query ($id: bigint!) {
      companies_by_pk(id: $id) { id name }
    }`,
    { id }
  );
  return data.companies_by_pk;
}

async function countRows(endpoint, secret, table, where) {
  const data = await gql(
    endpoint,
    secret,
    `query ($where: ${table}_bool_exp!) {
      ${table}_aggregate(where: $where) {
        aggregate { count }
      }
    }`,
    { where }
  );
  return data[`${table}_aggregate`]?.aggregate?.count ?? 0;
}

async function previewCounts(endpoint, secret, sourceId) {
  const sourceFilter = { company_companies: { _eq: sourceId } };
  const sourceNotDeleted = {
    _and: [sourceFilter, { is_deleted: { _eq: false } }],
  };

  return {
    categories: await countRows(endpoint, secret, "categories", sourceNotDeleted),
    products: await countRows(endpoint, secret, "products", sourceNotDeleted),
    product_skus: await countRows(endpoint, secret, "product_skus", sourceNotDeleted),
    packages: await countRows(endpoint, secret, "packages", sourceFilter),
    company_products: await countRows(endpoint, secret, "company_products", sourceFilter),
    company_packages: await countRows(endpoint, secret, "company_packages", sourceFilter),
  };
}

/** 目标公司已有关联时，删除源公司侧会冲突的行 */
async function deleteConflictingCompanyProducts(endpoint, secret, sourceId, targetId) {
  const data = await gql(
    endpoint,
    secret,
    `mutation ($sourceId: bigint!, $targetId: bigint!) {
      delete_company_products(
        where: {
          company_companies: { _eq: $sourceId }
          product: {
            company_products: {
              company_companies: { _eq: $targetId }
            }
          }
        }
      ) {
        affected_rows
      }
    }`,
    { sourceId, targetId }
  );
  return data.delete_company_products?.affected_rows ?? 0;
}

async function deleteConflictingCompanyPackages(endpoint, secret, sourceId, targetId) {
  const data = await gql(
    endpoint,
    secret,
    `mutation ($sourceId: bigint!, $targetId: bigint!) {
      delete_company_packages(
        where: {
          company_companies: { _eq: $sourceId }
          package: {
            company_packages: {
              company_companies: { _eq: $targetId }
            }
          }
        }
      ) {
        affected_rows
      }
    }`,
    { sourceId, targetId }
  );
  return data.delete_company_packages?.affected_rows ?? 0;
}

async function migrateTable(endpoint, secret, table, where, targetId, extraSet = {}) {
  const set = { company_companies: targetId, ...extraSet };
  const data = await gql(
    endpoint,
    secret,
    `mutation ($where: ${table}_bool_exp!, $set: ${table}_set_input!) {
      update_${table}(where: $where, _set: $set) {
        affected_rows
      }
    }`,
    { where, set }
  );
  return data[`update_${table}`]?.affected_rows ?? 0;
}

async function runMigration(endpoint, secret, sourceId, targetId) {
  const sourceFilter = { company_companies: { _eq: sourceId } };
  const sourceNotDeleted = {
    _and: [sourceFilter, { is_deleted: { _eq: false } }],
  };

  const results = {};

  console.log("\n📦 处理 company_products 冲突...");
  results.deleted_conflicting_company_products = await deleteConflictingCompanyProducts(
    endpoint,
    secret,
    sourceId,
    targetId
  );
  console.log(`   已删除冲突行: ${results.deleted_conflicting_company_products}`);

  console.log("\n📦 处理 company_packages 冲突...");
  results.deleted_conflicting_company_packages = await deleteConflictingCompanyPackages(
    endpoint,
    secret,
    sourceId,
    targetId
  );
  console.log(`   已删除冲突行: ${results.deleted_conflicting_company_packages}`);

  console.log("\n1/6 迁移分类 categories...");
  results.categories = await migrateTable(
    endpoint,
    secret,
    "categories",
    sourceNotDeleted,
    targetId
  );
  console.log(`   ✅ ${results.categories} 条`);

  console.log("\n2/6 迁移商品 products...");
  results.products = await migrateTable(
    endpoint,
    secret,
    "products",
    sourceNotDeleted,
    targetId
  );
  console.log(`   ✅ ${results.products} 条`);

  console.log("\n3/6 迁移规格 product_skus...");
  results.product_skus = await migrateTable(
    endpoint,
    secret,
    "product_skus",
    sourceNotDeleted,
    targetId
  );
  console.log(`   ✅ ${results.product_skus} 条`);

  console.log("\n4/6 迁移套餐 packages...");
  results.packages = await migrateTable(
    endpoint,
    secret,
    "packages",
    sourceFilter,
    targetId
  );
  console.log(`   ✅ ${results.packages} 条`);

  console.log("\n5/6 迁移关联 company_products...");
  results.company_products = await migrateTable(
    endpoint,
    secret,
    "company_products",
    sourceFilter,
    targetId
  );
  console.log(`   ✅ ${results.company_products} 条`);

  console.log("\n6/6 迁移关联 company_packages...");
  results.company_packages = await migrateTable(
    endpoint,
    secret,
    "company_packages",
    sourceFilter,
    targetId
  );
  console.log(`   ✅ ${results.company_packages} 条`);

  return results;
}

async function main() {
  const { positional, flags } = parseArgs(process.argv);

  if (flags.help) {
    printHelp();
    process.exit(0);
  }

  if (positional.length < 2) {
    printHelp();
    process.exit(1);
  }

  const sourceId = Number(positional[0]);
  const targetId = Number(positional[1]);

  if (!Number.isInteger(sourceId) || sourceId <= 0) {
    console.error("❌ 源公司 ID 无效");
    process.exit(1);
  }
  if (!Number.isInteger(targetId) || targetId <= 0) {
    console.error("❌ 目标公司 ID 无效");
    process.exit(1);
  }
  if (sourceId === targetId) {
    console.error("❌ 源公司与目标公司不能相同");
    process.exit(1);
  }

  const goc = loadGocConfig();
  const endpoint = flags.endpoint || goc.endpoint;
  const secret = flags.secret || goc.secret;

  if (!endpoint || !secret) {
    console.error(
      "❌ 缺少 Hasura 配置。请设置 goc.config.ts 或环境变量 HASURA_ENDPOINT / HASURA_ADMIN_SECRET"
    );
    process.exit(1);
  }

  if (typeof fetch === "undefined") {
    console.error("❌ 需要 Node.js 18+");
    process.exit(1);
  }

  console.log("\n🔍 校验公司...");
  const [sourceCompany, targetCompany] = await Promise.all([
    fetchCompany(endpoint, secret, sourceId),
    fetchCompany(endpoint, secret, targetId),
  ]);

  if (!sourceCompany) {
    console.error(`❌ 源公司不存在: id=${sourceId}`);
    process.exit(1);
  }
  if (!targetCompany) {
    console.error(`❌ 目标公司不存在: id=${targetId}`);
    process.exit(1);
  }

  console.log(`\n📋 迁移计划`);
  console.log(`   源公司: [${sourceCompany.id}] ${sourceCompany.name}`);
  console.log(`   目标公司: [${targetCompany.id}] ${targetCompany.name}`);
  console.log(`   Hasura: ${endpoint}`);
  if (flags.dryRun) console.log(`   模式: dry-run（仅预览）`);

  console.log("\n📊 统计将迁移的数据...");
  const counts = await previewCounts(endpoint, secret, sourceId);
  const total =
    counts.categories +
    counts.products +
    counts.product_skus +
    counts.packages +
    counts.company_products +
    counts.company_packages;

  console.log(`
   categories:       ${counts.categories}
   products:         ${counts.products}
   product_skus:     ${counts.product_skus}
   packages:         ${counts.packages}
   company_products: ${counts.company_products}
   company_packages: ${counts.company_packages}
   ─────────────────────────
   合计（约）:       ${total} 条更新/删除
`);

  if (total === 0) {
    console.log("ℹ️  源公司下没有可迁移的商品库数据，已退出。");
    process.exit(0);
  }

  if (flags.dryRun) {
    console.log("✅ dry-run 完成，未写入数据库。");
    process.exit(0);
  }

  if (!flags.yes) {
    const ok = await confirm(
      `\n⚠️  将把「${sourceCompany.name}」的全部分类/商品/SKU/套餐归属改为「${targetCompany.name}」，是否继续`
    );
    if (!ok) {
      console.log("已取消。");
      process.exit(0);
    }
  }

  console.log("\n🚀 开始迁移...");
  const results = await runMigration(endpoint, secret, sourceId, targetId);

  console.log("\n🎉 迁移完成！");
  console.log(JSON.stringify(results, null, 2));
  console.log(
    "\n💡 若目标公司为系统总部（default_company_id），其它公司将自动在列表中看到「系统配置」数据。"
  );
}

main().catch((err) => {
  console.error("\n❌ 迁移失败:", err.message);
  process.exit(1);
});
