import { Configuration, OpenAIApi } from "openai";
import Koa from "koa";
import Router from "koa-router";

const port = Number(process.env.PORT || 3000);
const apiKey = process.env.APP_KEY || process.env.OPENAI_API_KEY || "";
const organization = process.env.APP_ORG || process.env.OPENAI_ORG;
const textModel = process.env.OPENAI_TEXT_MODEL || "gpt-3.5-turbo-instruct";

const openai = apiKey
  ? new OpenAIApi(
      new Configuration({
        organization,
        apiKey,
      }),
    )
  : null;

const app = new Koa();
const router = new Router();

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      error: "Internal server error",
      message: error?.message || "Unknown error",
    };
  }
});

router.get("/", (ctx) => {
  ctx.body = {
    service: "chatGPT-nodejs",
    status: "ok",
    endpoints: ["/health", "/chat?prompt=...", "/image?prompt=..."],
  };
});

router.get("/health", (ctx) => {
  ctx.body = {
    status: "ok",
    openaiConfigured: Boolean(openai),
  };
});

router.get("/chat", async (ctx) => {
  const prompt = String(ctx.request.query.prompt || "").trim();

  if (!openai) {
    ctx.status = 503;
    ctx.body = {
      error: "OpenAI API key is not configured",
      expectedEnv: ["APP_KEY", "OPENAI_API_KEY"],
    };
    return;
  }

  if (!prompt) {
    ctx.status = 400;
    ctx.body = { error: "Query param `prompt` is required" };
    return;
  }

  const res = await openai.createCompletion({
    model: textModel,
    prompt,
    max_tokens: 1024,
    temperature: 0.2,
  });

  ctx.body = { choices: res.data.choices };
});

router.get("/image", async (ctx) => {
  const prompt = String(ctx.request.query.prompt || "").trim();

  if (!openai) {
    ctx.status = 503;
    ctx.body = {
      error: "OpenAI API key is not configured",
      expectedEnv: ["APP_KEY", "OPENAI_API_KEY"],
    };
    return;
  }

  if (!prompt) {
    ctx.status = 400;
    ctx.body = { error: "Query param `prompt` is required" };
    return;
  }

  const res = await openai.createImage({
    prompt,
    size: "256x256",
    n: 1,
  });

  ctx.body = { url: res.data.data[0]?.url || null };
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

