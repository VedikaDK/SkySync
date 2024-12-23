# Use the official Node.js image
FROM node:18.9.1

# Set the working directory in the container
WORKDIR /app

# Copy only package.json and package-lock.json to leverage Docker caching
COPY frontend/package*.json ./

# Install production dependencies only
RUN npm install --production

# Copy the rest of the application code
COPY frontend/ ./

# Build the application for production
RUN npm run build

# Install a lightweight HTTP server for serving the static build files
RUN npm install -g serve

# Set environment variables
ENV HOST=0.0.0.0
ENV PORT=3000

# Expose the port the app will run on
EXPOSE 3000

# Command to serve the production build
CMD ["serve", "-s", "build", "-l", "3000"]
