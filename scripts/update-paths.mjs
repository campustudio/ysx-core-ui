#!/usr/bin/env node
/**
 * 更新配置文件中的图片路径
 *
 * 读取 image-mapping.json，将所有外部 URL 替换为本地路径
 *
 * 用法：node scripts/update-paths.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CONFIG_DIR = path.join(ROOT, "src/app/config");
const MAPPING_FILE = path.join(__dirname, "image-mapping.json");

// 需要更新的配置文件
const CONFIG_FILES = [
  "images.ts",
  "player-data.ts",
  "newlife-data.ts",
  "articles-data.ts",
  "podcasts-data.ts",
  "activities-data.ts",
  "handbook-data.ts",
  "audio-sources.ts",
];

function main() {
  // 读取映射文件
  if (!fs.existsSync(MAPPING_FILE)) {
    console.error(
      "❌ 映射文件不存在，请先运行 node scripts/localize-images.mjs",
    );
    process.exit(1);
  }

  const mapping = JSON.parse(fs.readFileSync(MAPPING_FILE, "utf-8"));
  const urlCount = Object.keys(mapping).length;
  console.log(`📋 加载了 ${urlCount} 个 URL 映射\n`);

  let totalReplacements = 0;

  for (const file of CONFIG_FILES) {
    const filePath = path.join(CONFIG_DIR, file);
    if (!fs.existsSync(filePath)) {
      console.log(`⏭️  跳过（不存在）: ${file}`);
      continue;
    }

    let content = fs.readFileSync(filePath, "utf-8");
    let replacements = 0;

    for (const [oldUrl, newPath] of Object.entries(mapping)) {
      // 转义 URL 中的特殊字符用于正则
      const escapedUrl = oldUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(escapedUrl, "g");
      const matches = content.match(regex);

      if (matches) {
        content = content.replace(regex, newPath);
        replacements += matches.length;
      }
    }

    if (replacements > 0) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ ${file}: 替换了 ${replacements} 处`);
      totalReplacements += replacements;
    } else {
      console.log(`⏭️  ${file}: 无需替换`);
    }
  }

  console.log(`\n🎉 完成！共替换 ${totalReplacements} 处图片路径`);
  console.log("\n下一步:");
  console.log("  1. 运行 pnpm build 验证构建");
  console.log("  2. 运行 pnpm dev 本地预览");
  console.log("  3. 确认无误后重新部署到 OSS");
}

main();
