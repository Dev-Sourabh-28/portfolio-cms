FROM node:20-alpine

WORKDIR /app

# Install global helper
RUN npm install -g concurrently

# Copy root package.json (start script) and install global deps
COPY package*.json ./
RUN npm install --no-audit --no-fund

# Install server deps
COPY server/package*.json ./server/
RUN cd server && npm install --no-audit --no-fund

# Install client deps
COPY client/package*.json ./client/
RUN npm install --legacy-peer-deps --no-audit --no-fund

# Copy the rest of the repo
COPY . .

# Generate prisma client for the server
RUN cd server && npx prisma generate

# Build the Next client
RUN cd client && npm run build

EXPOSE 3000 5000

# Start both server and client using the root start script (concurrently)
CMD ["npm", "start"]