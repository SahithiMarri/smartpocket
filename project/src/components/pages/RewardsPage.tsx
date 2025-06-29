import React, { useState, useEffect } from 'react';
import { Trophy, Star, Calendar, Award } from 'lucide-react';
import { storage } from '../../utils/storage';
import { Badge } from '../../types';
import { initialBadges } from '../../data/mockData';

export function RewardsPage() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [totalSaved, setTotalSaved] = useState(0);

  useEffect(() => {
    const loadData = () => {
      const storedBadges = storage.getBadges();
      const transactions = storage.getTransactions();
      const balance = storage.getBalance();
      
      setBadges(storedBadges.length > 0 ? storedBadges : initialBadges);
      setTotalTransactions(transactions.length);
      setTotalSaved(Math.max(0, balance));
    };

    loadData();
    const interval = setInterval(loadData, 1000);
    return () => clearInterval(interval);
  }, []);

  const earnedBadges = badges.filter(badge => badge.earned);
  const availableBadges = badges.filter(badge => !badge.earned);

  const stats = [
    { label: 'Badges Earned', value: earnedBadges.length, emoji: '🏆', color: 'text-yellow-600' },
    { label: 'Transactions', value: totalTransactions, emoji: '📊', color: 'text-blue-600' },
    { label: 'Money Saved', value: `₹${totalSaved}`, emoji: '💰', color: 'text-green-600' },
    { label: 'Achievement Rate', value: `${Math.round((earnedBadges.length / badges.length) * 100)}%`, emoji: '🎯', color: 'text-purple-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-yellow/30 via-white to-soft-pink/30 pb-20 pt-6">
      <div className="px-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Rewards & Badges 🏆</h1>
          <p className="text-gray-600">Celebrate your money management wins!</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-4 shadow-lg text-center">
              <div className="text-2xl mb-2">{stat.emoji}</div>
              <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
              <div className="text-xs text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Earned Badges */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-6 h-6 text-yellow-600" />
            <h2 className="text-xl font-bold text-gray-800">Earned Badges ({earnedBadges.length})</h2>
          </div>
          
          {earnedBadges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {earnedBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="bg-gradient-to-r from-yellow-100 to-orange-100 p-4 rounded-xl border-2 border-yellow-300 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-800 px-2 py-1 rounded-bl-lg text-xs font-bold">
                    EARNED
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-4xl animate-bounce-slow">{badge.emoji}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 mb-1">{badge.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{badge.description}</p>
                      {badge.earnedDate && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar size={12} />
                          <span>Earned {badge.earnedDate.toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Trophy size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">No badges earned yet! 🤔</p>
              <p className="text-sm">Keep using SmartPocket to unlock achievements!</p>
            </div>
          )}
        </div>

        {/* Available Badges */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-6 h-6 text-gray-400" />
            <h2 className="text-xl font-bold text-gray-800">Available Badges ({availableBadges.length})</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableBadges.map((badge) => (
              <div
                key={badge.id}
                className="bg-gray-50 p-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="text-4xl grayscale opacity-50">{badge.emoji}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 mb-1">{badge.title}</h3>
                    <p className="text-sm text-gray-600">{badge.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Motivational Section */}
        <div className="bg-gradient-to-r from-pastel-purple to-pastel-blue rounded-2xl p-6 text-white text-center mt-8">
          <Award size={48} className="mx-auto mb-4 animate-wiggle" />
          <h3 className="text-xl font-bold mb-2">Keep Going! 🌟</h3>
          <p className="text-sm opacity-90">
            Every transaction brings you closer to earning more badges. 
            You're building great money habits! 💪
          </p>
        </div>
      </div>
    </div>
  );
}