'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { dbService } from '@/services';
import { Loader2, Smile, Frown, Meh, ThumbsUp, Heart } from 'lucide-react';

export default function MoodCheckin() {
    const { user } = useAuth();
    const [selectedMood, setSelectedMood] = useState<number | null>(null);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    const moods = [
        { value: 1, icon: Frown, label: 'Mal', color: 'text-red-500 bg-red-50' },
        { value: 2, icon: Meh, label: 'Mais ou menos', color: 'text-orange-500 bg-orange-50' },
        { value: 3, icon: Smile, label: 'Bem', color: 'text-yellow-500 bg-yellow-50' },
        { value: 4, icon: ThumbsUp, label: 'Ótimo', color: 'text-blue-500 bg-blue-50' },
        { value: 5, icon: Heart, label: 'Incrível', color: 'text-pink-500 bg-pink-50' },
    ];

    const handleSave = async () => {
        if (!user || !selectedMood) return;
        setLoading(true);
        try {
            await dbService.addMood(user.uid, selectedMood, comment);
            setDone(true);
        } catch (error) {
            console.error('Error saving mood:', error);
        } finally {
            setLoading(false);
        }
    };

    if (done) {
        return (
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-border text-center py-10">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Smile className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">Check-in realizado!</h3>
                <p className="text-muted-foreground">Continue cuidando de você.</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-border">
            <h3 className="text-xl font-bold mb-1">Como você está agora?</h3>
            <p className="text-muted-foreground text-sm mb-6">Registre seu humor em segundos.</p>

            <div className="flex justify-between gap-2 mb-6">
                {moods.map((m) => (
                    <button
                        key={m.value}
                        onClick={() => setSelectedMood(m.value)}
                        className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-2xl transition-all ${selectedMood === m.value
                                ? `${m.color} ring-2 ring-offset-2 ring-primary/20 scale-105 shadow-md`
                                : 'hover:bg-muted/50 text-muted-foreground hover:scale-105'
                            }`}
                    >
                        <m.icon className={`w-8 h-8 ${selectedMood === m.value ? 'fill-current' : ''}`} />
                        <span className="text-xs font-medium hidden sm:block">{m.label}</span>
                    </button>
                ))}
            </div>

            {selectedMood && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Quer adicionar uma nota? (opcional)"
                        className="w-full p-3 rounded-xl border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm mb-4 resize-none"
                        rows={2}
                    />
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Salvar Check-in'}
                    </button>
                </div>
            )}
        </div>
    );
}
