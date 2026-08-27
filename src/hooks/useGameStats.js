import { useState, useEffect, useCallback } from 'react';

const STATS_KEY = 'matchy.stats';
const ACHIEVEMENTS_KEY = 'matchy.achievements';

const DEFAULT_STATS = {
  gamesPlayed: 0,
  gamesWon: 0,
  gamesLost: 0,
  totalGuesses: 0,
  perfectGames: 0, // Won with all lives remaining
  currentStreak: 0,
  bestStreak: 0,
  bestGuessCount: null, // Fewest guesses to win
  fastestWin: null, // Fastest time to win (in seconds)
  hardModeWins: 0,
  normalModeWins: 0,
  lastPlayed: null,
};

const ACHIEVEMENT_DEFINITIONS = [
  {
    id: 'first_win',
    name: 'First Victory',
    description: 'Win your first game',
    emoji: '🎉',
    check: (stats) => stats.gamesWon >= 1,
  },
  {
    id: 'perfect_game',
    name: 'Flawless',
    description: 'Win a game without losing any lives',
    emoji: '💎',
    check: (stats) => stats.perfectGames >= 1,
  },
  {
    id: 'streak_3',
    name: 'Hot Streak',
    description: 'Win 3 games in a row',
    emoji: '🔥',
    check: (stats) => stats.bestStreak >= 3,
  },
  {
    id: 'streak_5',
    name: 'Unstoppable',
    description: 'Win 5 games in a row',
    emoji: '⚡',
    check: (stats) => stats.bestStreak >= 5,
  },
  {
    id: 'streak_10',
    name: 'Legend',
    description: 'Win 10 games in a row',
    emoji: '👑',
    check: (stats) => stats.bestStreak >= 10,
  },
  {
    id: 'games_10',
    name: 'Getting Started',
    description: 'Play 10 games',
    emoji: '🎮',
    check: (stats) => stats.gamesPlayed >= 10,
  },
  {
    id: 'games_50',
    name: 'Dedicated',
    description: 'Play 50 games',
    emoji: '🏆',
    check: (stats) => stats.gamesPlayed >= 50,
  },
  {
    id: 'games_100',
    name: 'Centurion',
    description: 'Play 100 games',
    emoji: '💯',
    check: (stats) => stats.gamesPlayed >= 100,
  },
  {
    id: 'hard_mode',
    name: 'Challenge Accepted',
    description: 'Win a game in Hard mode',
    emoji: '💪',
    check: (stats) => stats.hardModeWins >= 1,
  },
  {
    id: 'hard_mode_10',
    name: 'Hard Mode Master',
    description: 'Win 10 games in Hard mode',
    emoji: '🥇',
    check: (stats) => stats.hardModeWins >= 10,
  },
  {
    id: 'efficient',
    name: 'Efficient Solver',
    description: 'Win a game in 5 guesses or fewer',
    emoji: '🎯',
    check: (stats) => stats.bestGuessCount !== null && stats.bestGuessCount <= 5,
  },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Win a game in under 60 seconds',
    emoji: '⏱️',
    check: (stats) => stats.fastestWin !== null && stats.fastestWin < 60,
  },
];

export function useGameStats() {
  const [stats, setStats] = useState(() => {
    try {
      const stored = localStorage.getItem(STATS_KEY);
      return stored ? { ...DEFAULT_STATS, ...JSON.parse(stored) } : DEFAULT_STATS;
    } catch {
      return DEFAULT_STATS;
    }
  });

  const [unlockedAchievements, setUnlockedAchievements] = useState(() => {
    try {
      const stored = localStorage.getItem(ACHIEVEMENTS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [newAchievements, setNewAchievements] = useState([]);

  useEffect(() => {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(unlockedAchievements));
  }, [unlockedAchievements]);

  const checkAchievements = useCallback((newStats) => {
    const newlyUnlocked = [];
    
    ACHIEVEMENT_DEFINITIONS.forEach((achievement) => {
      if (
        !unlockedAchievements.includes(achievement.id) &&
        achievement.check(newStats)
      ) {
        newlyUnlocked.push(achievement);
      }
    });

    if (newlyUnlocked.length > 0) {
      setUnlockedAchievements((prev) => [
        ...prev,
        ...newlyUnlocked.map((a) => a.id),
      ]);
      setNewAchievements(newlyUnlocked);
      
      // Clear new achievements after 5 seconds
      setTimeout(() => {
        setNewAchievements([]);
      }, 5000);
    }
  }, [unlockedAchievements]);

  const recordGame = useCallback(
    ({ won, mode, guessCount, livesRemaining, timeElapsed }) => {
      setStats((prev) => {
        const newStats = {
          ...prev,
          gamesPlayed: prev.gamesPlayed + 1,
          gamesWon: won ? prev.gamesWon + 1 : prev.gamesWon,
          gamesLost: won ? prev.gamesLost : prev.gamesLost + 1,
          totalGuesses: prev.totalGuesses + guessCount,
          lastPlayed: new Date().toISOString(),
        };

        if (won) {
          // Update streak
          newStats.currentStreak = prev.currentStreak + 1;
          newStats.bestStreak = Math.max(newStats.currentStreak, prev.bestStreak);

          // Track mode-specific wins
          if (mode === 'hard') {
            newStats.hardModeWins = prev.hardModeWins + 1;
          } else {
            newStats.normalModeWins = prev.normalModeWins + 1;
          }

          // Check for perfect game
          const maxLives = mode === 'hard' ? 3 : 5;
          if (livesRemaining === maxLives) {
            newStats.perfectGames = prev.perfectGames + 1;
          }

          // Update best guess count
          if (prev.bestGuessCount === null || guessCount < prev.bestGuessCount) {
            newStats.bestGuessCount = guessCount;
          }

          // Update fastest win
          if (timeElapsed && (prev.fastestWin === null || timeElapsed < prev.fastestWin)) {
            newStats.fastestWin = timeElapsed;
          }
        } else {
          // Lost - reset streak
          newStats.currentStreak = 0;
        }

        // Check for new achievements
        checkAchievements(newStats);

        return newStats;
      });
    },
    [checkAchievements]
  );

  const resetStats = useCallback(() => {
    setStats(DEFAULT_STATS);
    setUnlockedAchievements([]);
    setNewAchievements([]);
  }, []);

  const getWinRate = useCallback(() => {
    if (stats.gamesPlayed === 0) return 0;
    return Math.round((stats.gamesWon / stats.gamesPlayed) * 100);
  }, [stats]);

  const getAverageGuesses = useCallback(() => {
    if (stats.gamesWon === 0) return 0;
    return (stats.totalGuesses / stats.gamesWon).toFixed(1);
  }, [stats]);

  const getAllAchievements = useCallback(() => {
    return ACHIEVEMENT_DEFINITIONS.map((achievement) => ({
      ...achievement,
      unlocked: unlockedAchievements.includes(achievement.id),
    }));
  }, [unlockedAchievements]);

  return {
    stats,
    recordGame,
    resetStats,
    getWinRate,
    getAverageGuesses,
    achievements: getAllAchievements(),
    newAchievements,
  };
}
