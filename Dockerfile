# Base image
FROM node:lts-alpine

# Set working directory
WORKDIR /app

# Copy package files first to leverage caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy application source code
COPY . .

# Build the application
RUN npm run build

# Remove dev dependencies for production
RUN npm ci --omit=dev

# Command to run the application
CMD ["npm", "run", "start:prod"]
