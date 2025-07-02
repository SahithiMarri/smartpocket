export interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  type: 'income' | 'expense';
  date: Date;
  emoji: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  emoji: string;
  color: string;
}

export interface Badge {
  _id?: string;                // MongoDB will return _id
  title: string;
  description: string;
  emoji: string;
  earned?: boolean;           // Calculated on frontend
  earnedDate?: Date;          // Set when earned
}

export interface Quiz {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  emoji: string;
}

export interface VoiceParseResult {
  amount: number;
  category: string;
  type: 'income' | 'expense';
  description: string;
  confidence: number;
}