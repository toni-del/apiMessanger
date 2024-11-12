FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

COPY .env.docker .env

EXPOSE 3000
