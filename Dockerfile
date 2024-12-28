# Base image
FROM node:lts-alpine

# Set working directory
WORKDIR /app

# Copy package files first to leverage caching
COPY ./package.json ./package-lock.json ./

# Install dependencies
RUN npm ci --only=production --omit=dev

# Copy application source code
COPY . .

# Build the application
RUN npm run build

# Command to run the application
CMD ["npm", "run", "start:prod"]
