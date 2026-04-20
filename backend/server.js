
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes.js';
import './db.js';



dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api', routes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'ISC 2026 Backend API is running' });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}!`);
});

export { app };



