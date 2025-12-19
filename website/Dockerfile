# Use Node.js LTS
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Install 'serve' globally to run the static site
RUN npm install -g serve

# Expose the port Railway uses
EXPOSE 3000

# Start command
CMD ["serve", "-s", "dist", "-l", "3000"]
