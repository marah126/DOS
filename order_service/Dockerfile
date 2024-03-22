# Use an Ubuntu base image
FROM ubuntu:latest

# Set the working directory to /home
WORKDIR /home

# Update package list and install Node.js
RUN apt-get update && \
    apt-get install -y nodejs npm

# Create directory for the Node.js application
RUN mkdir -p /home/microservices/order_service

# Set the working directory to the Node.js application directory
WORKDIR /home/microservices/order_service

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies including express and axios
RUN npm install express axios

# Install other dependencies
RUN npm install

# Copy application files
COPY . .

# Expose port
EXPOSE 3003

# Command to run the application
CMD node index.js
