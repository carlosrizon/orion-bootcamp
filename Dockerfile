FROM node:16-alpine AS development


WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY tsconfig*.json ./
COPY package*.json ./

COPY . .

RUN npm install

RUN chown -R node /app/node_modules

USER node

EXPOSE 8080
CMD [ "npm", "run", "start:dev" ]