ARG IMAGE=node:14.19.2-alpine
ARG NODE_ENV=production

FROM $IMAGE as build

WORKDIR /usr/app

COPY . .

ENV NODE_ENV $NODE_ENV

RUN npm install @nestjs/cli -g && \
  npm ci --quiet --no-progress && \
  npm run build

RUN npm prune

FROM $IMAGE

WORKDIR /usr/app

USER node

COPY --chown=node:node --from=build /usr/app/dist /usr/app/dist
COPY --chown=node:node --from=build /usr/app/node_modules /usr/app/node_modules

CMD ["node", "dist/main.js"]%
