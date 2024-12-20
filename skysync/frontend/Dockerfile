# Use a specific version of the Node.js base image
FROM node:18.9.1

# Set the working directory inside the container
WORKDIR /app

# Copy the frontend package.json into the container's working directory
COPY skysync/frontend/package.json .

# Install dependencies based on the package.json
RUN npm install

# Copy the rest of the frontend directory into the container
COPY . .  # Ensure all files are copied correctly

# Expose the port that the app will run on
EXPOSE 3000

# Run the start script to launch the application
CMD ["npm", "start"]
