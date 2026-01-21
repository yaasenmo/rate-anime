FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install backend dependencies
WORKDIR /app/backend
RUN npm install

# Install frontend dependencies and build
WORKDIR /app/frontend
RUN npm install
COPY frontend/ ./
RUN npm run build

# Copy backend source
WORKDIR /app/backend
COPY backend/ ./

# Copy anime images (using JSON array syntax for paths with special characters)
WORKDIR /app
COPY ["Anime, photos", "./Anime, photos/"]

# Set environment and start
WORKDIR /app/backend
ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "server.js"]
