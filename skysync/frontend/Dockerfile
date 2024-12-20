FROM node:18.9.1

WORKDIR /app

COPY frontend/package.json .

RUN npm install

COPY frontend/ .
# Set environment variables for HOST and PORT
ENV HOST=0.0.0.0
ENV PORT=3000

# Expose the port the app will run on
EXPOSE 3000

CMD ["npm", "start"]
