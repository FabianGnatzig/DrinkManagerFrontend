# Step 1: Build the app
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Build production assets
RUN npm run build

# Step 2: Serve with a simple Node server
FROM node:18-alpine

WORKDIR /app

# Install 'serve' globally
RUN npm install -g serve

# Copy the built files from the previous stage
COPY --from=build /app/dist ./dist

# Expose port 5173
EXPOSE 5173

# Start server
CMD ["serve", "-s", "dist", "-l", "5173"]
