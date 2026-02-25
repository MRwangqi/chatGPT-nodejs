FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN corepack enable && yarn install --frozen-lockfile --production

COPY index.js ./

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["yarn", "start"]
