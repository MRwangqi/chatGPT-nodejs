# chatGPT-nodejs

一个基于 Koa 的 Node.js 服务，提供两个 API：

- `GET /chat?prompt=...`
- `GET /image?prompt=...`

并提供健康检查接口：

- `GET /health`

## 环境变量

可使用以下任一命名方式配置 OpenAI：

- `APP_KEY` 或 `OPENAI_API_KEY`（必填，调用 AI 接口时）
- `APP_ORG` 或 `OPENAI_ORG`（可选）
- `OPENAI_TEXT_MODEL`（可选，默认 `gpt-3.5-turbo-instruct`）
- `PORT`（可选，默认 `3000`）

可以复制 `.env.example` 作为参考配置。

## 本地运行

```bash
yarn
PORT=3000 APP_KEY=your_key yarn start
```

启动后访问：

- `http://localhost:3000/health`

## Docker 部署

构建镜像：

```bash
docker build -t chatgpt-nodejs .
```

运行容器：

```bash
docker run -p 3000:3000 \
  -e PORT=3000 \
  -e APP_KEY=your_key \
  -e APP_ORG=your_org \
  chatgpt-nodejs
```

## Railway 部署

项目已包含 `railway.toml`，可直接部署：

1. 在 Railway 创建项目并连接仓库
2. 在 Railway Variables 中设置环境变量（至少设置 `APP_KEY`）
3. 部署后用 `/health` 进行健康检查

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new)
