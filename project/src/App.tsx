import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { FloatingAssistant } from './components/FloatingAssistant';
import { HomePage } from './components/pages/HomePage';
import { Dashboard } from './components/pages/Dashboard';
import { VoicePage } from './components/pages/VoicePage';
import { RewardsPage } from './components/pages/RewardsPage';
import { QuizPage } from './components/pages/QuizPage';
import { Login } from './components/pages/Login';
import { Register } from './components/pages/Register';
import { storage } from './utils/storage';
import { initialSavingsGoals, initialBadges } from './data/mockData';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [username, setUsername] = useState<string | null>(null);

  // Initialize app data on first load
  useEffect(() => {
    // Initialize savings goals if not present
    const existingGoals = storage.getSavingsGoals();
    if (existingGoals.length === 0) {
      storage.saveSavingsGoals(initialSavingsGoals);
    }

    // Initialize badges if not present
    const existingBadges = storage.getBadges();
    if (existingBadges.length === 0) {
      storage.saveBadges(initialBadges);
    }
  }, []);

  const handleLoginSuccess = (username: string) => {
    setUsername(username);
    setCurrentPage('dashboard');
  };

  const renderPage = () => {
    if (!username) {
      switch (currentPage) {
        case 'login':
          return <Login onLoginSuccess={handleLoginSuccess} onPageChange={setCurrentPage} />;
        case 'register':
          return <Register onPageChange={setCurrentPage} />;
        default:
          return <Login onLoginSuccess={handleLoginSuccess} onPageChange={setCurrentPage} />;
      }
    }

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'voice':
        return <VoicePage />;
      case 'rewards':
        return <RewardsPage />;
      case 'quiz':
        return <QuizPage />;
      case 'home':
        return <HomePage onPageChange={setCurrentPage} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {username && <p className="p-2 text-right text-gray-600">Welcome, {username}!</p>}
      {renderPage()}
      {username && <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />}
      <FloatingAssistant />
    </div>
  );
}

export default App;
