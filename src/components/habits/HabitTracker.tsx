'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { dbService } from '@/services';
import { Habit } from '@/types';
import { Plus, Flame, Check, X } from 'lucide-react';

export default function HabitTracker() {
    const { user } = useAuth();
    const [habits, setHabits] = useState<Habit[]>([]);
    const [loading, setLoading] = useState(true);
    const [newHabit, setNewHabit] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    // Generate last 7 days for the calendar view
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d;
    });

    useEffect(() => {
        if (user) loadHabits();
    }, [user]);

    const loadHabits = async () => {
        if (!user) return;
        try {
            const data = await dbService.getHabits(user.uid);
            setHabits(data);
        } catch (error) {
            console.error('Error loading habits:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddHabit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !newHabit.trim()) return;

        try {
            await dbService.addHabit(user.uid, newHabit);
            setNewHabit('');
            setIsAdding(false);
            loadHabits();
        } catch (error) {
            console.error('Error adding habit:', error);
        }
    };

    const toggleHabit = async (habitId: string, date: Date) => {
        if (!user) return;
        const dateStr = date.toISOString().split('T')[0];

        // Optimistic update
        setHabits(prev => prev.map(h => {
            if (h.id === habitId) {
                const isCompleted = h.completedDates.includes(dateStr);
                const newDates = isCompleted
                    ? h.completedDates.filter(d => d !== dateStr)
                    : [...h.completedDates, dateStr];
                return { ...h, completedDates: newDates };
            }
            return h;
        }));

        try {
            await dbService.toggleHabit(habitId, dateStr);
            loadHabits(); // Sync with server (mock) to get correct streak
        } catch (error) {
            console.error('Error toggling habit:', error);
            loadHabits(); // Revert on error
        }
    };

    if (loading) return <div className="animate-pulse h-48 bg-gray-100 rounded-3xl"></div>;

    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-border h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Hábitos</h3>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="p-2 hover:bg-muted rounded-full transition-colors"
                >
                    {isAdding ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </button>
            </div>

            {isAdding && (
                <form onSubmit={handleAddHabit} className="mb-4 flex gap-2">
                    <input
                        type="text"
                        value={newHabit}
                        onChange={(e) => setNewHabit(e.target.value)}
                        placeholder="Novo hábito..."
                        className="flex-1 px-3 py-2 rounded-xl border border-border text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                        autoFocus
                    />
                    <button
                        type="submit"
                        className="bg-primary text-white px-3 py-2 rounded-xl text-sm font-medium hover:bg-primary/90"
                    >
                        Add
                    </button>
                </form>
            )}

            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {habits.length === 0 && !isAdding ? (
                    <p className="text-center text-sm text-muted-foreground py-4">
                        Crie hábitos para acompanhar seu progresso!
                    </p>
                ) : (
                    habits.map((habit) => (
                        <div key={habit.id} className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-sm">{habit.title}</span>
                                <div className="flex items-center gap-1 text-xs text-orange-500 font-bold">
                                    <Flame className="w-3 h-3 fill-orange-500" />
                                    {habit.streak} dias
                                </div>
                            </div>
                            <div className="grid grid-cols-7 gap-1">
                                {last7Days.map((date, i) => {
                                    const dateStr = date.toISOString().split('T')[0];
                                    const isCompleted = habit.completedDates.includes(dateStr);
                                    const isToday = i === 6;

                                    return (
                                        <button
                                            key={dateStr}
                                            onClick={() => toggleHabit(habit.id, date)}
                                            title={date.toLocaleDateString('pt-BR')}
                                            className={`
                        aspect-square rounded-lg flex items-center justify-center transition-all
                        ${isCompleted
                                                    ? 'bg-primary text-white shadow-sm'
                                                    : 'bg-muted/50 hover:bg-muted text-transparent hover:text-muted-foreground'
                                                }
                        ${isToday ? 'ring-2 ring-primary/20' : ''}
                      `}
                                        >
                                            <Check className="w-3 h-3" />
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="flex justify-between text-[10px] text-muted-foreground px-1">
                                {last7Days.map(d => (
                                    <span key={d.toISOString()}>{d.toLocaleDateString('pt-BR', { weekday: 'narrow' })}</span>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
