import { useEffect, useState } from 'react';

export default function AchievementToast({ achievements }) {
  const [visible, setVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (achievements.length > 0) {
      setVisible(true);
      setCurrentIndex(0);
    }
  }, [achievements]);

  useEffect(() => {
    if (!visible) return;

    const timer = setTimeout(() => {
      if (currentIndex < achievements.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setVisible(false);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [visible, currentIndex, achievements.length]);

  if (!visible || achievements.length === 0) return null;

  const achievement = achievements[currentIndex];

  return (
    <div
      className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 achievement-toast"
      style={{
        animation: 'slideDown 0.4s ease-out',
      }}
    >
      <div
        className="flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
          minWidth: '320px',
          maxWidth: '90vw',
        }}
      >
        <div
          className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center"
          style={{
            background: 'rgba(255, 255, 255, 0.3)',
            fontSize: '1.75rem',
          }}
        >
          {achievement.emoji}
        </div>
        <div className="flex-1">
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: 'rgba(0, 0, 0, 0.6)',
              marginBottom: '0.25rem',
            }}
          >
            Achievement Unlocked!
          </div>
          <div
            style={{
              fontSize: '1rem',
              fontWeight: 700,
              color: '#000',
              marginBottom: '0.125rem',
            }}
          >
            {achievement.name}
          </div>
          <div
            style={{
              fontSize: '0.8rem',
              color: 'rgba(0, 0, 0, 0.7)',
            }}
          >
            {achievement.description}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translate(-50%, -20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        .achievement-toast {
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
