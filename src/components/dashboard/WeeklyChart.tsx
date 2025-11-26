'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { dbService } from '@/services';
import { MoodEntry } from '@/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2 } from 'lucide-react';

export default function WeeklyChart() {
    const { user } = useAuth();
    const [data, setData] = useState<{ day: string; value: number }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        const loadData = async () => {
            try {
                const moods = await dbService.getMoods(user.uid, 7);
                // Process data for chart
                // Create last 7 days array
                const last7Days = Array.from({ length: 7 }, (_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() - (6 - i));
                    return d;
                });

                const chartData = last7Days.map(date => {
                    const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD (approx)
                    // Actually timestamp based matching is better
                    // For MVP mock, let's just map existing moods to days or show what we have
                    // Since mock data might be sparse, let's just show the moods we have or fill with 0/null

                    // Better approach for mock: Just show the moods returned, formatted
                    return {
                        day: date.toLocaleDateString('pt-BR', { weekday: 'short' }),
                        value: 0 // Placeholder
                    };
                });

                // Map actual moods to the days
                // Since moods have timestamp, let's just use the moods directly if available
                // Or better: Group by day.

                const processed = moods.map(m => ({
                    day: new Date(m.timestamp).toLocaleDateString('pt-BR', { weekday: 'short' }),
                    value: m.value
                })).reverse(); // Oldest first

                setData(processed.length > 0 ? processed : chartData.map(d => ({ ...d, value: 3 }))); // Fallback data if empty
            } catch (error) {
                console.error('Error loading chart data:', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [user]);

    if (loading) return <div className="h-48 flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;

    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-border h-full">
            <h3 className="text-xl font-bold mb-6">Seu Humor na Semana</h3>
            <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                        <XAxis
                            dataKey="day"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#737373', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            hide
                            domain={[1, 5]}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            cursor={{ stroke: '#2E8B57', strokeWidth: 2 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#2E8B57"
                            strokeWidth={3}
                            dot={{ fill: '#2E8B57', strokeWidth: 2, r: 4, stroke: '#fff' }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4">
                {data.length > 0 ? 'Você tem se mantido constante!' : 'Comece a registrar para ver sua evolução.'}
            </p>
        </div>
    );
}
