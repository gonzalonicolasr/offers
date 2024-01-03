FROM node:18.18-alpine AS base

# Builder image
FROM base AS builder
WORKDIR /usr/src/app
COPY --chown=node:node package*.json ./
RUN npm ci
COPY --chown=node:node . .
RUN npm run build

# Distribution image
FROM base AS distribution
ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app
COPY --chown=node:node package*.json .env.development .env.test .env.production ./
RUN npm ci --omit=dev
COPY --from=builder --chown=node:node /usr/src/app/dist ./dist
USER node
ENTRYPOINT ["sh", "-c","export DT_HOST_ID=ag-highlighted-offers-$RANDOM && node dist/main.js"]
