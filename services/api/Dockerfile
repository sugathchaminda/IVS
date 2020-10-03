FROM node:12.4-alpine

RUN mkdir /app
WORKDIR /app

COPY package.json package.json
RUN yarn

COPY . .
EXPOSE 4000
CMD ["yarn", "server:dev"]
