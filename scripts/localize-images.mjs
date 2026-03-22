#!/usr/bin/env node
/**
 * 图片本地化脚本
 *
 * 功能：
 * 1. 扫描所有配置文件，提取 Unsplash 图片 URL
 * 2. 下载图片到 public/images/
 * 3. 生成路径映射文件
 *
 * 用法：node scripts/localize-images.mjs
 */

import fs from "fs";
import path from "path";
import https from "https";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CONFIG_DIR = path.join(ROOT, "src/app/config");
const OUTPUT_DIR = path.join(ROOT, "public/images");

// 确保输出目录存在
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// 提取所有 Unsplash URL
function extractUrls() {
  const urls = new Map(); // url -> filename
  const configFiles = [
    "images.ts",
    "player-data.ts",
    "newlife-data.ts",
    "articles-data.ts",
    "podcasts-data.ts",
    "activities-data.ts",
    "handbook-data.ts",
    "audio-sources.ts",
  ];

  for (const file of configFiles) {
    const filePath = path.join(CONFIG_DIR, file);
    if (!fs.existsSync(filePath)) continue;

    const content = fs.readFileSync(filePath, "utf-8");
    const regex =
      /https:\/\/images\.unsplash\.com\/photo-([a-zA-Z0-9-]+)\?[^"'\s]+/g;
    let match;

    while ((match = regex.exec(content)) !== null) {
      const url = match[0];
      const photoId = match[1];
      if (!urls.has(url)) {
        // 生成简短的文件名
        const shortId = photoId.substring(0, 12);
        urls.set(url, `img-${shortId}.jpg`);
      }
    }
  }

  return urls;
}

// 下载单个图片
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(OUTPUT_DIR, filename);

    // 如果文件已存在，跳过
    if (fs.existsSync(filePath)) {
      console.log(`⏭️  已存在: ${filename}`);
      resolve(filename);
      return;
    }

    // 使用较小尺寸（w=800）以减少体积
    const smallUrl = url.replace(/w=\d+/, "w=800").replace(/q=\d+/, "q=75");

    console.log(`⬇️  下载中: ${filename}`);

    const file = fs.createWriteStream(filePath);
    https
      .get(smallUrl, (response) => {
        // 处理重定向
        if (response.statusCode === 301 || response.statusCode === 302) {
          https
            .get(response.headers.location, (res) => {
              res.pipe(file);
              file.on("finish", () => {
                file.close();
                resolve(filename);
              });
            })
            .on("error", reject);
        } else {
          response.pipe(file);
          file.on("finish", () => {
            file.close();
            resolve(filename);
          });
        }
      })
      .on("error", (err) => {
        fs.unlink(filePath, () => {});
        reject(err);
      });
  });
}

// 主函数
async function main() {
  console.log("🔍 扫描配置文件中的图片...\n");

  const urls = extractUrls();
  console.log(`📦 找到 ${urls.size} 张唯一图片\n`);

  // 下载所有图片
  console.log("📥 开始下载...\n");
  const results = [];

  for (const [url, filename] of urls) {
    try {
      await downloadImage(url, filename);
      results.push({ url, filename, success: true });
      // 延迟避免请求过快
      await new Promise((r) => setTimeout(r, 300));
    } catch (err) {
      console.error(`❌ 下载失败: ${filename} - ${err.message}`);
      results.push({ url, filename, success: false, error: err.message });
    }
  }

  // 生成映射文件
  const mapping = {};
  for (const { url, filename, success } of results) {
    if (success) {
      mapping[url] = `/images/${filename}`;
    }
  }

  const mappingPath = path.join(ROOT, "scripts/image-mapping.json");
  fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2));
  console.log(`\n✅ 映射文件已生成: scripts/image-mapping.json`);

  // 统计
  const successCount = results.filter((r) => r.success).length;
  const failCount = results.filter((r) => !r.success).length;
  console.log(`\n📊 完成: ${successCount} 成功, ${failCount} 失败`);

  if (failCount > 0) {
    console.log("\n失败列表:");
    results
      .filter((r) => !r.success)
      .forEach((r) => {
        console.log(`  - ${r.filename}: ${r.error}`);
      });
  }

  console.log("\n下一步: 运行 node scripts/update-paths.mjs 更新配置文件");
}

main().catch(console.error);
