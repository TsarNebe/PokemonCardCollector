# Use Node.js LTS image for backend
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose API port
EXPOSE 5000

# Start the Node.js server
CMD ["node", "server.js"]