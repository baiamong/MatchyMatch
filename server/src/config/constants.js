import config from './env.js';

export const LIVES_BY_DIFFICULTY = {
  easy: 7,
  normal: 5,
  hard: 3,
  expert: 1,
};

export const RECONNECT_GRACE_MS = 30000;

export const SESSION_CONFIG = {
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  httpOnly: true,
  secure: config.server.nodeEnv === 'production',
  sameSite: 'strict',
};

export const DIFFICULTIES = ['easy', 'normal', 'hard', 'expert'];

export const MATCH_RESULTS = ['player1_win', 'player2_win', 'draw', 'abandoned'];
