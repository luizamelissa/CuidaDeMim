'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import MoodCheckin from '@/components/dashboard/MoodCheckin';
import PrioritiesList from '@/components/dashboard/PrioritiesList';
import DailyGuide from '@/components/dashboard/DailyGuide';
import MotivationalMessage from '@/components/dashboard/MotivationalMessage';
import WeeklyChart from '@/components/dashboard/WeeklyChart';
import HabitTracker from '@/components/habits/HabitTracker';

export default function DashboardPage() {
    const { user } = useAuth();
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        setCurrentDate(new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }));
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Olá, {user?.displayName?.split(' ')[0]}!</h1>
                    <p className="text-muted-foreground">Vamos cuidar de você hoje.</p>
                </div>
                {currentDate && (
                    <div className="text-sm text-muted-foreground bg-white px-4 py-2 rounded-full border border-border">
                        {currentDate}
                    </div>
                )}
            </div>

            <MotivationalMessage />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="space-y-6 md:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <MoodCheckin />
                        <DailyGuide />
                    </div>
                    <WeeklyChart />
                </div>

                {/* Right Column */}
                <div className="md:col-span-1 h-full space-y-6">
                    <PrioritiesList />
                    <HabitTracker />
                </div>
            </div>
        </div>
    );
}
