ARG IMAGE=node:14.18-alpine
ARG NODE_ENV=production

FROM $IMAGE as build

WORKDIR /usr/app

COPY . .

ENV NODE_ENV $NODE_ENV

RUN npm install @nestjs/cli -g && \
  npm ci --only=production --quiet --no-progress && \
  npm run build

FROM $IMAGE

WORKDIR /usr/app

USER node

COPY --chown=node:node --from=build /usr/app/dist /usr/app/dist
COPY --chown=node:node --from=build /usr/app/node_modules /usr/app/node_modules
COPY --chown=node:node --from=build /usr/app/templates /usr/app/templates
COPY --chown=node:node --from=build /usr/app/public /usr/app/public

CMD ["node", "dist/main.js"]%
