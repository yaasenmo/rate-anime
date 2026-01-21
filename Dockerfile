FROM node:18

WORKDIR /app

# Copy all source files first
COPY backend/ ./backend/
COPY frontend/ ./frontend/
COPY ["Anime, photos", "./Anime, photos/"]

# Install backend dependencies
WORKDIR /app/backend
RUN npm install

# Install frontend dependencies and build
WORKDIR /app/frontend
RUN npm install
RUN npm run build

# Set environment and start
WORKDIR /app/backend
ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "server.js"]
