import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import { pool } from './config/database.js';
import config from './config/env.js';
import { SESSION_CONFIG } from './config/constants.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const PgSession = connectPgSimple(session);

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Allow for development
}));

// CORS configuration
app.use(cors({
  origin: config.frontend.url,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  store: new PgSession({
    pool,
    tableName: 'session',
    createTableIfMissing: false,
  }),
  secret: config.session.secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: SESSION_CONFIG.maxAge,
    httpOnly: SESSION_CONFIG.httpOnly,
    secure: SESSION_CONFIG.secure,
    sameSite: SESSION_CONFIG.sameSite,
  },
  name: 'matchymatch.sid',
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes will be added here in future sessions
// app.use('/api/auth', authRoutes);
// app.use('/api/puzzles', puzzlesRoutes);
// app.use('/api/matches', matchesRoutes);
// app.use('/api/leaderboard', leaderboardRoutes);
// app.use('/api/admin', adminRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

export default app;
