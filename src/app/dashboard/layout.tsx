'use client';

import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Heart, Sun, Moon } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, loading, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-muted/20 flex flex-col">
            <header className="bg-background border-b border-border sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/dashboard" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
                        <Heart className="w-6 h-6" fill="currentColor" />
                        <span className="font-bold text-lg hidden sm:inline">Cuida de Mim</span>
                    </Link>

                    <nav className="flex items-center gap-4">
                        <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                            Home
                        </Link>
                        {user?.goal === 'focus' && (
                            <Link href="/focus" className="text-sm font-medium hover:text-primary transition-colors">
                                Modo Foco
                            </Link>
                        )}
                        {user?.goal === 'anxiety' && (
                            <Link href="/anxiety" className="text-sm font-medium hover:text-primary transition-colors">
                                Reduzir Ansiedade
                            </Link>
                        )}
                        {user?.goal === 'productivity' && (
                            <Link href="/organization" className="text-sm font-medium hover:text-primary transition-colors">
                                Organização
                            </Link>
                        )}
                        <Link href="/diary" className="text-sm font-medium hover:text-primary transition-colors">
                            Diário
                        </Link>
                        <Link href="/profile" className="text-sm font-medium hover:text-primary transition-colors">
                            Perfil
                        </Link>

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-muted transition-colors"
                            aria-label="Toggle theme"
                        >
                            {theme === 'light' ? (
                                <Moon className="w-5 h-5" />
                            ) : (
                                <Sun className="w-5 h-5" />
                            )}
                        </button>

                        <button
                            onClick={handleLogout}
                            className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                        >
                            Sair
                        </button>
                    </nav>
                </div>
            </header>

            <main className="flex-1 container mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    );
}
