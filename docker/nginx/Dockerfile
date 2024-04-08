FROM node:20-alpine AS build

RUN apk update
RUN apk --no-cache add bash git yarn
RUN npm install -g browserslist

COPY frontend /app
WORKDIR /app
RUN browserslist --update-db
RUN yarn install
RUN yarn build

FROM nginx:1.25.3-alpine
COPY --from=build /app/build /app/build
WORKDIR /app
COPY docker/nginx/config.conf /etc/nginx/conf.d/default.conf
RUN apk update

ENTRYPOINT ["nginx", "-g", "daemon off;"]
