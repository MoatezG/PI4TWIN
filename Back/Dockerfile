# Use official Node.js LTS image (Debian-based for better compatibility with TensorFlow.js)
FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies, including devDependencies, so tfjs-node can be installed via Docker even if not in package.json
RUN npm install && npm install @tensorflow/tfjs-node@4.20.0

# Install additional system dependencies required by TensorFlow.js
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    python3-dev \
    python3-pip \
    libatlas-base-dev \
    gfortran \
    && rm -rf /var/lib/apt/lists/*

# Copy the rest of the application code
COPY . .

# Ensure the model directory is present in the image (in case .dockerignore excludes it)
COPY ./priority_model ./priority_model

# Expose port (commonly 3000 or 5000 for Node apps; adjust if needed)
EXPOSE 5000

# Start the application
ENV NODE_ENV=development
CMD ["npm", "run", "dev"]
