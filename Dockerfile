# ===============================================================
# Build the backend
# ===============================================================

FROM node:8-alpine as build-frontend
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app

RUN yarn
RUN yarn build:js

ENV TTR_PORT 4040
EXPOSE 4040

ENTRYPOINT ["yarn", "server"]