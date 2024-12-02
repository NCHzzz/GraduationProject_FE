# Use the official Node.js image as the base image
FROM node:alpine as build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./
COPY package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code to the working directory
COPY . .


# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]