FROM node:8
WORKDIR /usr/src/app
COPY package.json .
RUN yarn install --verbose
COPY . .
EXPOSE 8081
CMD [ "npm", "start" ]