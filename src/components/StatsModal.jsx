import { clsx } from 'clsx';

export default function StatsModal({ stats, achievements, onClose, onReset }) {
  const winRate = stats.gamesPlayed > 0 
    ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) 
    : 0;
  
  const avgGuesses = stats.gamesWon > 0 
    ? (stats.totalGuesses / stats.gamesWon).toFixed(1) 
    : '0.0';

  const formatTime = (seconds) => {
    if (!seconds) return '--';
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl"
        style={{
          background: 'var(--bg-surface)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        }}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between p-6 border-b"
          style={{
            background: 'var(--bg-surface)',
            borderColor: 'var(--border)',
          }}
        >
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: 'var(--label-primary)',
            }}
          >
            📊 Statistics & Achievements
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
            style={{
              background: 'var(--bg-tertiary)',
              color: 'var(--label-secondary)',
            }}
            aria-label="Close"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Overview Stats */}
          <div>
            <h3
              className="mb-4"
              style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: 'var(--label-tertiary)',
              }}
            >
              Overview
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard
                label="Games Played"
                value={stats.gamesPlayed}
                emoji="🎮"
              />
              <StatCard
                label="Win Rate"
                value={`${winRate}%`}
                emoji="🎯"
              />
              <StatCard
                label="Current Streak"
                value={stats.currentStreak}
                emoji="🔥"
              />
              <StatCard
                label="Best Streak"
                value={stats.bestStreak}
                emoji="⚡"
              />
            </div>
          </div>

          {/* Detailed Stats */}
          <div>
            <h3
              className="mb-4"
              style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: 'var(--label-tertiary)',
              }}
            >
              Records
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <StatRow
                label="Games Won"
                value={stats.gamesWon}
                icon="✅"
              />
              <StatRow
                label="Games Lost"
                value={stats.gamesLost}
                icon="❌"
              />
              <StatRow
                label="Perfect Games"
                value={stats.perfectGames}
                icon="💎"
              />
              <StatRow
                label="Average Guesses"
                value={avgGuesses}
                icon="🎲"
              />
              <StatRow
                label="Best Guess Count"
                value={stats.bestGuessCount ?? '--'}
                icon="🏆"
              />
              <StatRow
                label="Fastest Win"
                value={formatTime(stats.fastestWin)}
                icon="⏱️"
              />
              <StatRow
                label="Normal Mode Wins"
                value={stats.normalModeWins}
                icon="🟢"
              />
              <StatRow
                label="Hard Mode Wins"
                value={stats.hardModeWins}
                icon="🔴"
              />
            </div>
          </div>

          {/* Achievements */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  color: 'var(--label-tertiary)',
                }}
              >
                Achievements
              </h3>
              <span
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'var(--accent)',
                }}
              >
                {unlockedCount} / {totalCount}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {achievements.map((achievement) => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                />
              ))}
            </div>
          </div>

          {/* Reset Button */}
          {stats.gamesPlayed > 0 && (
            <div className="pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to reset all statistics? This cannot be undone.')) {
                    onReset();
                  }
                }}
                className="w-full py-3 px-4 rounded-xl font-medium transition-colors"
                style={{
                  background: 'var(--bg-tertiary)',
                  color: 'var(--label-secondary)',
                  fontSize: '0.9rem',
                }}
              >
                Reset All Statistics
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, emoji }) {
  return (
    <div
      className="p-4 rounded-2xl text-center"
      style={{
        background: 'var(--bg-secondary)',
      }}
    >
      <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>
        {emoji}
      </div>
      <div
        style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          color: 'var(--accent)',
          marginBottom: '0.25rem',
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: '0.75rem',
          color: 'var(--label-tertiary)',
          letterSpacing: '-0.01em',
        }}
      >
        {label}
      </div>
    </div>
  );
}

function StatRow({ label, value, icon }) {
  return (
    <div
      className="flex items-center justify-between p-3 rounded-xl"
      style={{
        background: 'var(--bg-secondary)',
      }}
    >
      <div className="flex items-center gap-2">
        <span style={{ fontSize: '1.1rem' }}>{icon}</span>
        <span
          style={{
            fontSize: '0.875rem',
            color: 'var(--label-secondary)',
          }}
        >
          {label}
        </span>
      </div>
      <span
        style={{
          fontSize: '0.95rem',
          fontWeight: 600,
          color: 'var(--label-primary)',
        }}
      >
        {value}
      </span>
    </div>
  );
}

function AchievementCard({ achievement }) {
  const { name, description, emoji, unlocked } = achievement;

  return (
    <div
      className={clsx(
        'p-4 rounded-xl transition-all',
        unlocked ? 'scale-100' : 'opacity-50'
      )}
      style={{
        background: unlocked
          ? 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)'
          : 'var(--bg-secondary)',
        border: unlocked ? '2px solid var(--accent)' : '2px solid transparent',
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
          style={{
            background: unlocked
              ? 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)'
              : 'var(--bg-tertiary)',
            fontSize: '1.5rem',
          }}
        >
          {unlocked ? emoji : '🔒'}
        </div>
        <div className="flex-1 min-w-0">
          <h4
            style={{
              fontSize: '0.95rem',
              fontWeight: 600,
              color: 'var(--label-primary)',
              marginBottom: '0.25rem',
            }}
          >
            {name}
          </h4>
          <p
            style={{
              fontSize: '0.8rem',
              color: 'var(--label-tertiary)',
              lineHeight: 1.4,
            }}
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
