# Rate My Anime

A full-stack anime rating website where users can discover, rate, and discuss their favorite anime.

## Features

- **User Authentication**: Sign up, login, and guest mode
- **Anime Grid**: Browse anime with images, descriptions, and ratings
- **Like & Save**: Like anime and save them for later
- **Comments**: Leave comments on anime pages
- **Star Ratings**: Rate anime from 1-5 stars
- **Search**: Find anime by title
- **Recommendations**: View top-rated anime
- **Responsive Design**: Works on desktop and mobile

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

### Frontend
- React 18
- React Router v6
- Tailwind CSS
- Axios
- Lucide React Icons

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)

### Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env`:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ratemyanime
   JWT_SECRET=your_super_secret_jwt_key_change_in_production
   JWT_EXPIRE=7d
   ```

4. Seed the database with anime data:
   ```bash
   node seed.js
   ```

5. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open http://localhost:3000 in your browser

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/guest` - Guest login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Anime
- `GET /api/anime` - Get all anime (supports `?search=` query)
- `GET /api/anime/:id` - Get single anime
- `GET /api/anime/recommendations` - Get top rated anime
- `GET /api/anime/saved` - Get user's saved anime
- `POST /api/anime/:id/like` - Like/unlike anime
- `POST /api/anime/:id/save` - Save/unsave anime

### Comments
- `GET /api/comments/anime/:animeId` - Get comments for anime
- `POST /api/comments/anime/:animeId` - Add comment
- `DELETE /api/comments/:id` - Delete comment

### Ratings
- `GET /api/ratings/anime/:animeId` - Get ratings for anime
- `GET /api/ratings/anime/:animeId/user` - Get user's rating
- `POST /api/ratings/anime/:animeId` - Add/update rating

## Project Structure

```
Ratemyanime/
├── Anime, photos/          # Anime images
├── backend/
│   ├── config/             # Database configuration
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Auth & error middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── server.js           # Express server
│   └── seed.js             # Database seeder
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/     # React components
    │   ├── context/        # Auth context
    │   ├── pages/          # Page components
    │   ├── services/       # API service
    │   ├── App.jsx
    │   └── index.js
    └── tailwind.config.js
```

## License

MIT
