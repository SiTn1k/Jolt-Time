import React, { useState, useEffect } from 'react';
import { TelegramMiniApp } from './telegram/miniapp';

// Types for Telegram WebApp
declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready: () => void;
        expand: () => void;
        enableClosingConfirmation: () => void;
        close: () => void;
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
          };
        };
        themeParams: Record<string, string>;
        colorScheme: 'light' | 'dark';
      };
    };
  }
}

const App: React.FC = () => {
  const [telegramUser, setTelegramUser] = useState<{ id: number; first_name: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<'home' | 'daily-rewards' | 'profile'>('home');

  useEffect(() => {
    // Initialize Telegram WebApp
    if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
      setTelegramUser(window.Telegram.WebApp.initDataUnsafe.user as any);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="app-loading">
        <div className="loader"></div>
        <p>Loading Jolt Time...</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <h1>⚡ Jolt Time</h1>
        {telegramUser && (
          <span className="user-greeting">Hello, {telegramUser.first_name}!</span>
        )}
      </header>

      {/* Navigation */}
      <nav className="app-nav">
        <button 
          className={currentScreen === 'home' ? 'active' : ''} 
          onClick={() => setCurrentScreen('home')}
        >
          🏠 Home
        </button>
        <button 
          className={currentScreen === 'daily-rewards' ? 'active' : ''} 
          onClick={() => setCurrentScreen('daily-rewards')}
        >
          🎁 Daily Rewards
        </button>
        <button 
          className={currentScreen === 'profile' ? 'active' : ''} 
          onClick={() => setCurrentScreen('profile')}
        >
          👤 Profile
        </button>
      </nav>

      {/* Content */}
      <main className="app-content">
        {currentScreen === 'home' && (
          <div className="screen home-screen">
            <h2>Welcome to Jolt Time!</h2>
            <p>Travel through time and discover historical anomalies.</p>
            <div className="quick-actions">
              <button className="btn-primary" onClick={() => setCurrentScreen('daily-rewards')}>
                Claim Daily Reward
              </button>
            </div>
          </div>
        )}

        {currentScreen === 'daily-rewards' && (
          <div className="screen rewards-screen">
            <h2>🎁 Daily Rewards</h2>
            <p>Claim your daily rewards and build your streak!</p>
            <div className="rewards-grid">
              {[1, 2, 3, 4, 5, 6, 7].map(day => (
                <div key={day} className={`reward-day ${day <= 3 ? 'claimed' : ''}`}>
                  <span className="day-number">Day {day}</span>
                  <span className="reward-icon">💎</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentScreen === 'profile' && (
          <div className="screen profile-screen">
            <h2>👤 Profile</h2>
            {telegramUser ? (
              <div className="profile-info">
                <p><strong>ID:</strong> {telegramUser.id}</p>
                <p><strong>Name:</strong> {telegramUser.first_name}</p>
              </div>
            ) : (
              <p>Not connected to Telegram</p>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>© 2024 Jolt Time - Time Travel Educational Mini App</p>
      </footer>
    </div>
  );
};

export default App;
