import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown, Target, Plus } from 'lucide-react';
import { storage } from '../../utils/storage';
import { Transaction, SavingsGoal } from '../../types';
import { initialSavingsGoals } from '../../data/mockData';
import { getCategoryEmoji } from '../../utils/voiceParser';

export function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const loadData = () => {
      const storedTransactions = storage.getTransactions();
      const storedGoals = storage.getSavingsGoals();
      
      setTransactions(storedTransactions);
      setSavingsGoals(storedGoals.length > 0 ? storedGoals : initialSavingsGoals);
      setBalance(storage.getBalance());
    };

    loadData();
    const interval = setInterval(loadData, 1000);
    return () => clearInterval(interval);
  }, []);

  // Prepare expense data for pie chart
  const expenseData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const existing = acc.find(item => item.name === t.category);
      if (existing) {
        existing.value += t.amount;
      } else {
        acc.push({ name: t.category, value: t.amount, emoji: getCategoryEmoji(t.category) });
      }
      return acc;
    }, [] as { name: string; value: number; emoji: string }[]);

  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#6B7280'];

  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-20 pt-8">
      <div className="px-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-slate-800 mb-3">Financial Dashboard</h1>
          <p className="text-slate-600 text-lg">Complete overview of your financial activity</p>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-8 text-white mb-10 shadow-2xl">
          <div className="text-center">
            <p className="text-blue-100 text-lg mb-3">Total Balance</p>
            <p className="text-5xl md:text-6xl font-bold mb-6">₹{balance.toLocaleString()}</p>
            <div className="flex justify-center gap-8 text-lg">
              <div className="flex items-center gap-2 bg-white/20 rounded-2xl px-4 py-2">
                <TrendingUp size={20} />
                <span>Income: ₹{totalIncome.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 rounded-2xl px-4 py-2">
                <TrendingDown size={20} />
                <span>Spent: ₹{totalExpenses.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Expense Breakdown */}
          {expenseData.length > 0 && (
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                Expense Breakdown
              </h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, emoji }) => `${emoji} ${name}`}
                    >
                      {expenseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`₹${value}`, 'Amount']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Savings Goals */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              Savings Goals
            </h2>
            <div className="space-y-6">
              {savingsGoals.map((goal) => {
                const progress = (goal.currentAmount / goal.targetAmount) * 100;
                return (
                  <div key={goal.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{goal.emoji}</span>
                        <div>
                          <span className="font-bold text-slate-800 text-lg">{goal.title}</span>
                          <p className="text-slate-600 text-sm">
                            ₹{goal.currentAmount.toLocaleString()} / ₹{goal.targetAmount.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-slate-800">{progress.toFixed(0)}%</div>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-4">
                      <div
                        className="h-4 rounded-full transition-all duration-500 bg-gradient-to-r from-blue-500 to-green-500"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
            <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
            Recent Transactions
          </h2>
          {recentTransactions.length > 0 ? (
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors border border-slate-100"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm">
                      {transaction.emoji}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-lg">{transaction.description}</p>
                      <p className="text-slate-600 capitalize">{transaction.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-xl ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount}
                    </p>
                    <p className="text-sm text-slate-500">
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp size={32} className="text-slate-400" />
              </div>
              <p className="text-xl mb-2">No transactions yet</p>
              <p className="text-slate-400">Start by adding your first transaction using voice input</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}