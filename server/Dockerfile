FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY prisma ./prisma/

# Install packages including dev dependencies (needed for build)
RUN npm install

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Remove dev dependencies to slim down image (optional, skipping for safety for now)
# RUN npm prune --production

# Expose API port
EXPOSE 3001

# Start command
CMD ["npm", "start"]
