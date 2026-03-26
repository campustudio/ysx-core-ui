#!/bin/bash
# 微信授权流程本地验证脚本
# 用于快速验证代码逻辑而无需每次手动点击

echo "=========================================="
echo "微信授权流程验证脚本"
echo "=========================================="

# 配置
WX_APPID="wx61079aa3f7c3bd14"
APP_DOMAIN="https://www.metamindpt.com"
API_BASE_URL="https://api.metamindpt.com"
REDIRECT_URI="${APP_DOMAIN}/app/index.html"

echo ""
echo "1. 检查微信授权 URL 构造"
echo "----------------------------------------"
AUTH_URL="https://open.weixin.qq.com/connect/oauth2/authorize?appid=${WX_APPID}&redirect_uri=$(python3 -c "import urllib.parse; print(urllib.parse.quote('${REDIRECT_URI}', safe=''))")&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect"
echo "授权 URL: $AUTH_URL"
echo ""

echo "2. 检查后端 API 是否可达"
echo "----------------------------------------"
echo "测试 /health 端点..."
HEALTH_RESPONSE=$(curl -s "${API_BASE_URL}/health" 2>&1)
echo "响应: $HEALTH_RESPONSE"
echo ""

echo "3. 检查后端微信登录接口是否存在"
echo "----------------------------------------"
echo "测试 /auth/wx/login 端点（不带 code，应返回错误）..."
WX_LOGIN_RESPONSE=$(curl -s "${API_BASE_URL}/auth/wx/login" 2>&1)
echo "响应: $WX_LOGIN_RESPONSE"
echo ""

echo "4. 模拟微信浏览器访问前端"
echo "----------------------------------------"
echo "使用微信 User-Agent 访问前端..."
WX_UA="Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.0"
FRONTEND_RESPONSE=$(curl -s -I -A "$WX_UA" "${APP_DOMAIN}/app/index.html" 2>&1 | head -20)
echo "$FRONTEND_RESPONSE"
echo ""

echo "5. 检查前端 JS 文件是否包含授权逻辑"
echo "----------------------------------------"
JS_FILE=$(curl -s "${APP_DOMAIN}/app/index.html" 2>&1 | grep -oE 'assets/index-[a-zA-Z0-9]+\.js' | head -1)
if [ -n "$JS_FILE" ]; then
    echo "找到 JS 文件: $JS_FILE"
    echo "检查是否包含 isWechatBrowser..."
    JS_CONTENT=$(curl -s "${APP_DOMAIN}/app/${JS_FILE}" 2>&1)
    if echo "$JS_CONTENT" | grep -q "micromessenger"; then
        echo "✅ 找到 micromessenger 检测代码"
    else
        echo "❌ 未找到 micromessenger 检测代码 - 可能代码未更新"
    fi
    if echo "$JS_CONTENT" | grep -q "redirectToWxAuth\|oauth2/authorize"; then
        echo "✅ 找到授权跳转代码"
    else
        echo "❌ 未找到授权跳转代码 - 可能代码未更新"
    fi
else
    echo "❌ 未找到 JS 文件"
fi
echo ""

echo "=========================================="
echo "验证完成"
echo "=========================================="
echo ""
echo "如果上述检查都通过但仍然不跳转，请："
echo "1. 在微信中打开页面后，点击右上角 ... -> 开发者工具"
echo "2. 查看 Console 中是否有 [useUserStore] 开头的日志"
echo "3. 检查 userAgent 是否包含 MicroMessenger"
