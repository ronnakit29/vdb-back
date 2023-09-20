FROM node:18.16.0-alpine

COPY package.json .

RUN npm install

COPY . .

CMD ["npm", "start"]