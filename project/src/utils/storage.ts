import { Transaction, SavingsGoal, Badge } from '../types';

const STORAGE_KEYS = {
  TRANSACTIONS: 'smartpocket_transactions',
  SAVINGS_GOALS: 'smartpocket_savings_goals',
  BADGES: 'smartpocket_badges',
  BALANCE: 'smartpocket_balance'
};

export const storage = {
  getTransactions: (): Transaction[] => {
    const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return data ? JSON.parse(data).map((t: any) => ({
      ...t,
      date: new Date(t.date)
    })) : [];
  },

  saveTransaction: (transaction: Transaction): void => {
    const transactions = storage.getTransactions();
    transactions.push(transaction);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  },

  getSavingsGoals: (): SavingsGoal[] => {
    const data = localStorage.getItem(STORAGE_KEYS.SAVINGS_GOALS);
    return data ? JSON.parse(data) : [];
  },

  saveSavingsGoals: (goals: SavingsGoal[]): void => {
    localStorage.setItem(STORAGE_KEYS.SAVINGS_GOALS, JSON.stringify(goals));
  },

  getBadges: (): Badge[] => {
    const data = localStorage.getItem(STORAGE_KEYS.BADGES);
    return data ? JSON.parse(data).map((b: any) => ({
      ...b,
      earnedDate: b.earnedDate ? new Date(b.earnedDate) : undefined
    })) : [];
  },

  saveBadges: (badges: Badge[]): void => {
    localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(badges));
  },

  getBalance: (): number => {
    const transactions = storage.getTransactions();
    return transactions.reduce((total, transaction) => {
      return transaction.type === 'income' 
        ? total + transaction.amount 
        : total - transaction.amount;
    }, 0);
  }
};