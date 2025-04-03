# English Every Day

一个基于 Nuxt 3 开发的英语学习应用。

## 技术栈

- Nuxt 3
- Vue 3
- Ant Design Vue
- Bootstrap 5
- JWT 认证
- 微信 OAuth2.0 登录

## 主要功能

### 用户认证
- 微信扫码登录
- JWT token 认证

### 学习功能
- 每日英语句子学习
- 听力练习(音频播放)
- 口语练习(录音功能)
- 单词学习(含音标、词性、翻译)
- 语法要点讲解
- 相关句子扩展练习

## 项目结构

```
├── assets/
│   └── css/              # 全局样式
├── components/           # 可复用组件
├── pages/               # 页面组件
├── public/              # 静态资源
│   ├── audio/           # 音频文件
│   └── sentences.json   # 句子数据
├── server/              # 服务端API
│   └── api/            
├── utils/              # 工具函数
└── nuxt.config.ts      # Nuxt配置
```

## 开发环境设置

1. 安装依赖:

```bash
pnpm install
```

2. 配置环境变量:
创建 `.env` 文件并设置以下变量:

```
WECHAT_APP_ID=你的微信AppID
WECHAT_APP_SECRET=你的微信AppSecret
JWT_SECRET=你的JWT密钥
```

3. 启动开发服务器:
```bash
pnpm dev
```

## 生产部署

1. 构建应用:
```bash
pnpm build
```

2. 启动生产服务器:
```bash
pnpm preview
```

## API 文档

### 微信登录
- 端点: `/api/wechat-login`
- 方法: GET
- 参数: `code` (微信授权码)
- 返回: 用户信息和JWT token

### 获取句子
- 端点: `/api/sentences`
- 方法: GET
- 头部: `Authorization: Bearer <token>`
- 返回: 句子列表数据

## 许可证

MIT License

## prisma

相关代码

    npx prisma migrate dev --name "add_some_tables"

    npx prisma studio
    http://localhost:5560

    npx prisma generate
