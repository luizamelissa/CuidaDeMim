export type UserGoal = 'anxiety' | 'focus' | 'productivity';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  bio?: string;
  ageRange?: string;
  goal?: UserGoal;
  plan: 'basic' | 'premium';
  createdAt: number;
  // Phase 2: Gamification
  level: number;
  xp: number;
  badges: string[];
}

export interface MoodEntry {
  id: string;
  userId: string;
  value: 1 | 2 | 3 | 4 | 5; // 1 = worst, 5 = best
  comment?: string;
  timestamp: number;
}

// Phase 2: Emotional Diary
export interface DiaryEntry {
  id: string;
  userId: string;
  emotion: string; // e.g., 'happy', 'sad', 'anxious'
  color: string; // Hex code
  title: string;
  content: string;
  tags: string[];
  timestamp: number;
}

export interface PriorityItem {
  id: string;
  userId: string;
  text: string;
  completed: boolean;
  date: string; // YYYY-MM-DD
  timestamp: number;
}

// Phase 2: Habits
export interface Habit {
  id: string;
  userId: string;
  title: string;
  frequency: 'daily' | 'weekly';
  streak: number;
  completedDates: string[]; // YYYY-MM-DD
  createdAt: number;
}

export interface AuthService {
  loginWithEmail(email: string, password: string): Promise<UserProfile>;
  registerWithEmail(email: string, password: string): Promise<UserProfile>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<UserProfile | null>;
  updateProfile(uid: string, data: Partial<UserProfile>): Promise<UserProfile>;
}

export interface DBService {
  // Moods
  addMood(userId: string, value: number, comment?: string): Promise<MoodEntry>;
  getMoods(userId: string, limit?: number): Promise<MoodEntry[]>;

  // Priorities
  addPriority(userId: string, text: string, date: string): Promise<PriorityItem>;
  getPriorities(userId: string, date: string): Promise<PriorityItem[]>;
  togglePriority(id: string, completed: boolean): Promise<void>;
  deletePriority(id: string): Promise<void>;

  // Phase 2: Diary
  addDiaryEntry(userId: string, entry: Omit<DiaryEntry, 'id' | 'userId' | 'timestamp'>): Promise<DiaryEntry>;
  getDiaryEntries(userId: string, limit?: number): Promise<DiaryEntry[]>;

  // Phase 2: Habits
  addHabit(userId: string, title: string): Promise<Habit>;
  getHabits(userId: string): Promise<Habit[]>;
  toggleHabit(habitId: string, date: string): Promise<void>;

  // User Data
  getUserProfile(uid: string): Promise<UserProfile | null>;
  createUserProfile(profile: UserProfile): Promise<void>;
}
