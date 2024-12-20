# Use a specific Node.js base image
FROM node:18.9.1

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker caching
COPY backend/package*.json ./

# Install dependencies inside the container
RUN npm install

# Install nodemon globally (if needed)
RUN npm install -g nodemon

# Install node-pre-gyp globally to support bcrypt's build process
RUN npm install -g node-pre-gyp

# Copy the rest of the application code
COPY . .

# Rebuild bcrypt with the proper environment
RUN npm rebuild bcrypt --build-from-source
ENV HOST=0.0.0.0
ENV PORT=5000
# Expose the application port
EXPOSE 5000

# Command to run the application
CMD ["npm", "start"]
