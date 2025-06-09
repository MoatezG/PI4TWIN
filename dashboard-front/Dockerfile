# Use official Node.js 20 image (LTS version)
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port for Vite dev server or production build (default 5173, change if needed)
EXPOSE 3000

# Start the Vite dev server (for development)
CMD ["npm", "run", "start"]
