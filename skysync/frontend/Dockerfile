FROM node:18.9.1

WORKDIR /app/frontend

COPY frontend/package.json ./package.json

RUN npm install

COPY frontend/ ./  # Copy all files in the frontend directory

EXPOSE 3000

CMD ["npm", "start"]
