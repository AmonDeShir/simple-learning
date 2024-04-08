FROM node:20-alpine

RUN apk update
RUN apk --no-cache add bash git yarn

COPY backend /app
WORKDIR /app
RUN yarn install
RUN yarn build

ENTRYPOINT ["yarn", "start"]
