# Use official Node.js image
FROM node:18-alpine

# Install pnpm globally
RUN npm install -g pnpm

# Set working directory inside container
WORKDIR /usr/src/app

# Configure pnpm to set global-bin-dir and avoid the error
RUN pnpm config set global-bin-dir /usr/local/bin

# Install NestJS CLI globally
RUN pnpm add -g @nestjs/cli

# Copy package.json and pnpm-lock.yaml for installing dependencies
COPY package.json pnpm-lock.yaml ./

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the application
RUN pnpm build

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["pnpm", "start"]
