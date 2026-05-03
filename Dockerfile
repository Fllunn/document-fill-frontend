FROM node:20.17.0-alpine AS base

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json package-lock.json* ./

RUN rm -f package-lock.json && npm install --legacy-peer-deps

FROM base AS build

COPY . .

RUN npm run build

FROM node:20.17.0-alpine AS production

ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /app

COPY --from=build /app/.output ./.output

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]