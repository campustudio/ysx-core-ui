# 阿里云 OSS 自动化部署指南

## 前置条件

- ossutil 已安装 ✅ (v1.7.16)
- 需要配置 AccessKey

---

## 步骤 1：创建 RAM 用户并获取 AccessKey

1. 打开 https://ram.console.aliyun.com/users
2. 点击「创建用户」
3. 用户名：`oss-deploy`（或自定义）
4. 勾选「OpenAPI 调用访问」
5. 创建后，点击用户名进入详情
6. 点击「创建 AccessKey」
7. **立即复制保存** AccessKey ID 和 AccessKey Secret

---

## 步骤 2：给 RAM 用户授权

1. 在用户详情页，点击「添加权限」
2. 搜索并选择 `AliyunOSSFullAccess`
3. 确认授权

---

## 步骤 3：配置 ossutil

在终端运行：

```bash
ossutil64 config
```

按提示输入：

- **Endpoint**: `oss-cn-hangzhou.aliyuncs.com`（根据 bucket 区域）
- **AccessKeyID**: 你的 AK ID
- **AccessKeySecret**: 你的 AK Secret

配置会保存在 `~/.ossutilconfig`

---

## 步骤 4：添加部署脚本

在 `package.json` 的 `scripts` 中添加：

```json
"deploy": "npm run build:deploy && ossutil64 cp -r deploy/ oss://metamindpt-com-site/ -f"
```

---

## 使用方法

```bash
# 一键构建并部署
npm run deploy
```

---

## 常用命令

```bash
# 查看 bucket 文件列表
ossutil64 ls oss://metamindpt-com-site/

# 上传单个文件
ossutil64 cp deploy/index.html oss://metamindpt-com-site/

# 上传整个目录（覆盖）
ossutil64 cp -r deploy/ oss://metamindpt-com-site/ -f

# 删除文件
ossutil64 rm oss://metamindpt-com-site/old-file.html
```

---

## 注意事项

- AccessKey Secret 只显示一次，请妥善保存
- 配置文件 `~/.ossutilconfig` 包含敏感信息，不要提交到 git
- 部署后清除浏览器缓存查看最新效果
