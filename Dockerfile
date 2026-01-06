FROM node:latest

ENV MONGO_DB_USERNAME=admin \
    MONGO_DB_PASSWORD=password

RUN mkdir "/home/app"

COPY . /home/app

WORKDIR /home/app

RUN npm install

CMD ["node","server/connection.js"]

