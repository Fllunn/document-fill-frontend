FROM node:22-alpine AS base

RUN apk add --no-cache libc6-compat

WORKDIR /app

ENV CI=true

COPY package.json ./

RUN npm install --legacy-peer-deps

FROM base AS build

COPY . .

RUN npm run build

FROM node:22-alpine AS production

RUN apk add --no-cache libc6-compat

ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /app

COPY --from=build /app/.output ./.output

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]