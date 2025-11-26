import { AuthService, DBService, MoodEntry, PriorityItem, UserProfile, DiaryEntry, Habit } from '@/types';

const STORAGE_KEYS = {
    USER: 'cdm_user',
    MOODS: 'cdm_moods',
    PRIORITIES: 'cdm_priorities',
    DIARY: 'cdm_diary',
    HABITS: 'cdm_habits',
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockAuthService: AuthService = {
    async loginWithEmail(email, password) {
        await delay(500);
        const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
        if (storedUser) {
            const user = JSON.parse(storedUser);
            if (user.email === email) return user;
        }
        // Auto-create for demo if not found, or just return a mock user
        const mockUser: UserProfile = {
            uid: 'mock-user-123',
            email,
            displayName: email.split('@')[0],
            plan: 'basic',
            createdAt: Date.now(),
            level: 1,
            xp: 0,
            badges: [],
        };
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mockUser));
        return mockUser;
    },

    async registerWithEmail(email, password) {
        await delay(500);
        const newUser: UserProfile = {
            uid: `user-${Date.now()}`,
            email,
            displayName: email.split('@')[0],
            plan: 'basic',
            createdAt: Date.now(),
            level: 1,
            xp: 0,
            badges: [],
        };
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
        return newUser;
    },

    async logout() {
        await delay(200);
        localStorage.removeItem(STORAGE_KEYS.USER);
    },

    async getCurrentUser() {
        if (typeof window === 'undefined') return null;
        const stored = localStorage.getItem(STORAGE_KEYS.USER);
        return stored ? JSON.parse(stored) : null;
    },

    async updateProfile(uid, data) {
        await delay(300);
        const stored = localStorage.getItem(STORAGE_KEYS.USER);
        if (!stored) throw new Error('No user found');
        const user = JSON.parse(stored);
        const updated = { ...user, ...data };
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
        return updated;
    },
};

export const mockDBService: DBService = {
    async addMood(userId, value, comment) {
        await delay(300);
        const moods: MoodEntry[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.MOODS) || '[]');
        const newMood: MoodEntry = {
            id: `mood-${Date.now()}`,
            userId,
            value: value as 1 | 2 | 3 | 4 | 5,
            comment,
            timestamp: Date.now(),
        };
        moods.push(newMood);
        localStorage.setItem(STORAGE_KEYS.MOODS, JSON.stringify(moods));
        return newMood;
    },

    async getMoods(userId, limit = 7) {
        await delay(300);
        const moods: MoodEntry[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.MOODS) || '[]');
        return moods
            .filter((m) => m.userId === userId)
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, limit);
    },

    async addPriority(userId, text, date) {
        await delay(300);
        const priorities: PriorityItem[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRIORITIES) || '[]');
        const newPriority: PriorityItem = {
            id: `prio-${Date.now()}`,
            userId,
            text,
            completed: false,
            date,
            timestamp: Date.now(),
        };
        priorities.push(newPriority);
        localStorage.setItem(STORAGE_KEYS.PRIORITIES, JSON.stringify(priorities));
        return newPriority;
    },

    async getPriorities(userId, date) {
        await delay(300);
        const priorities: PriorityItem[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRIORITIES) || '[]');
        return priorities.filter((p) => p.userId === userId && p.date === date);
    },

    async togglePriority(id, completed) {
        await delay(200);
        const priorities: PriorityItem[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRIORITIES) || '[]');
        const index = priorities.findIndex((p) => p.id === id);
        if (index !== -1) {
            priorities[index].completed = completed;
            localStorage.setItem(STORAGE_KEYS.PRIORITIES, JSON.stringify(priorities));
        }
    },

    async deletePriority(id) {
        await delay(200);
        const priorities: PriorityItem[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRIORITIES) || '[]');
        const filtered = priorities.filter((p) => p.id !== id);
        localStorage.setItem(STORAGE_KEYS.PRIORITIES, JSON.stringify(filtered));
    },

    // Phase 2: Diary
    async addDiaryEntry(userId, entry) {
        await delay(300);
        const entries: DiaryEntry[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.DIARY) || '[]');
        const newEntry: DiaryEntry = {
            id: `diary-${Date.now()}`,
            userId,
            ...entry,
            timestamp: Date.now(),
        };
        entries.push(newEntry);
        localStorage.setItem(STORAGE_KEYS.DIARY, JSON.stringify(entries));
        return newEntry;
    },

    async getDiaryEntries(userId, limit = 20) {
        await delay(300);
        const entries: DiaryEntry[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.DIARY) || '[]');
        return entries
            .filter((e) => e.userId === userId)
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, limit);
    },

    // Phase 2: Habits
    async addHabit(userId, title) {
        await delay(300);
        const habits: Habit[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.HABITS) || '[]');
        const newHabit: Habit = {
            id: `habit-${Date.now()}`,
            userId,
            title,
            frequency: 'daily',
            streak: 0,
            completedDates: [],
            createdAt: Date.now(),
        };
        habits.push(newHabit);
        localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
        return newHabit;
    },

    async getHabits(userId) {
        await delay(300);
        const habits: Habit[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.HABITS) || '[]');
        return habits.filter((h) => h.userId === userId);
    },

    async toggleHabit(habitId, date) {
        await delay(200);
        const habits: Habit[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.HABITS) || '[]');
        const index = habits.findIndex((h) => h.id === habitId);
        if (index !== -1) {
            const habit = habits[index];
            const dateIndex = habit.completedDates.indexOf(date);

            if (dateIndex === -1) {
                // Mark as done
                habit.completedDates.push(date);
                // Simple streak logic: if yesterday was done, increment. Else reset to 1.
                // For MVP, just count total completed for now or keep simple
                habit.streak += 1;
            } else {
                // Mark as undone
                habit.completedDates.splice(dateIndex, 1);
                habit.streak = Math.max(0, habit.streak - 1);
            }

            localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
        }
    },

    async getUserProfile(uid) {
        await delay(200);
        const stored = localStorage.getItem(STORAGE_KEYS.USER);
        return stored ? JSON.parse(stored) : null;
    },

    async createUserProfile(profile) {
        await delay(200);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(profile));
    },
};
