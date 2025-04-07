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

## other

prisma

    npx prisma migrate dev --name "add_some_tables"

    npx prisma studio
    http://localhost:5560

    npx prisma migrate deploy

    npx prisma generate

pnpm

    pnpm add lodash
    pnpm add -D @types/lodash

gen random jwt token

    openssl rand -base64 40

prisma client  issue

    rm -rf node_modules
    npm install
    npm run build
    node .output/server/index.mjs

## 部署

    export PATH="/home/ubuntu/download/node-v22.13.1-linux-x64/bin:$PATH"
    pnpm install
    pnpm build


    source ../env-english-every-day.sh
    node server/index.mjs

nginx

    location /en {
        # 代理到本地 3003 端口
        proxy_pass http://127.0.0.1:3003;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_http_version 1.1;

    }

    # prod
    mkdir -p /data/www/english-every-day/app
    mkdir -p /data/www/english-every-day/db

    # local
    npm run build
    rsync -avzP --delete .output/ qing2024:/data/www/english-every-day/app
    rsync -avzP ./prisma qing2024:/data/www/english-every-day/db/

    # prod
    $ cd /data/www/english-every-day
    $ cat env-myqpp.sh
    export WECHAT_APP_ID=
    export WECHAT_APP_SECRET=
    export JWT_SECRET=
    export DATABASE_URL="file:/data/www/english-every-day/db.db"
    export RETURN_URL="https://english-every-day.com/en/"
    export PORT=3003
    export NUXT_PUBLIC_RETURN_URL="https://myqpp.com/en/"
    export NUXT_PUBLIC_WECHAT_APP_ID=
    export NUXT_APP_BASE_URL="/en/"

    $ cd /data/www/english-every-day/db
    $ cat .env
    DATABASE_URL=file:/data/www/english-every-day/db.db
    $ npx prisma migrate deploy

    $ cd /data/www/english-every-day
    $ source env-english-every-day.sh
    $ node app/server/index.mjs