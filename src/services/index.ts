import { AuthService, DBService } from '@/types';
import { mockAuthService, mockDBService } from './mock';

// Placeholder for real services
// import { firebaseAuthService, firebaseDBService } from './firebase';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false'; // Default to true for MVP

export const authService: AuthService = USE_MOCK ? mockAuthService : mockAuthService; // Fallback to mock for now
export const dbService: DBService = USE_MOCK ? mockDBService : mockDBService;
