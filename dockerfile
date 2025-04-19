# Use official node image
FROM node:18-alpine

# Install pnpm globally
RUN npm install -g pnpm

# Set working directory inside container
WORKDIR /usr/src/app

RUN pnpm add -g @nestjs/cli

COPY package.json pnpm-lock.yaml ./
# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile
# Copy only the necessary files for building the application
COPY . .
# Build the application
RUN pnpm build
# Expose the port the app runs on
EXPOSE 3000
# Start the application
CMD ["pnpm", "start"]
