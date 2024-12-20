FROM node:18.9.1

WORKDIR /app

COPY frontend/package.json .

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
