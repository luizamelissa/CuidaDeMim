'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { dbService } from '@/services';
import { DiaryEntry } from '@/types';
import { Loader2, Plus, Calendar, Smile, Frown, Meh, Angry, Zap } from 'lucide-react';

const EMOTIONS = [
    { id: 'happy', label: 'Feliz', icon: Smile, color: '#22c55e' },
    { id: 'calm', label: 'Calmo', icon: Zap, color: '#3b82f6' },
    { id: 'neutral', label: 'Neutro', icon: Meh, color: '#9ca3af' },
    { id: 'sad', label: 'Triste', icon: Frown, color: '#6366f1' },
    { id: 'anxious', label: 'Ansioso', icon: Angry, color: '#ef4444' },
];

export default function DiaryPage() {
    const { user } = useAuth();
    const [entries, setEntries] = useState<DiaryEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    // Form State
    const [selectedEmotion, setSelectedEmotion] = useState(EMOTIONS[2]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        if (user) loadEntries();
    }, [user]);

    const loadEntries = async () => {
        if (!user) return;
        try {
            const data = await dbService.getDiaryEntries(user.uid);
            setEntries(data);
        } catch (error) {
            console.error('Error loading diary:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        try {
            await dbService.addDiaryEntry(user.uid, {
                emotion: selectedEmotion.id,
                color: selectedEmotion.color,
                title,
                content,
                tags: [],
            });
            setIsCreating(false);
            setTitle('');
            setContent('');
            loadEntries();
        } catch (error) {
            console.error('Error saving entry:', error);
        }
    };

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Diário Emocional</h1>
                    <p className="text-muted-foreground">Registre seus pensamentos e sentimentos.</p>
                </div>
                <button
                    onClick={() => setIsCreating(!isCreating)}
                    className="bg-primary text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-primary/90 transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Novo Registro
                </button>
            </div>

            {isCreating && (
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-border animate-in slide-in-from-top-4">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">Como você está se sentindo?</label>
                            <div className="flex gap-4 overflow-x-auto pb-2">
                                {EMOTIONS.map((emotion) => (
                                    <button
                                        key={emotion.id}
                                        type="button"
                                        onClick={() => setSelectedEmotion(emotion)}
                                        className={`flex flex-col items-center gap-2 p-3 rounded-xl min-w-[80px] transition-all ${selectedEmotion.id === emotion.id
                                            ? 'bg-primary/10 ring-2 ring-primary'
                                            : 'hover:bg-muted'
                                            }`}
                                    >
                                        <emotion.icon
                                            className="w-8 h-8"
                                            style={{ color: selectedEmotion.id === emotion.id ? emotion.color : '#6b7280' }}
                                        />
                                        <span className="text-xs font-medium">{emotion.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Título</label>
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-2 rounded-xl border border-border focus:ring-2 focus:ring-primary/20 outline-none"
                                placeholder="Resumo do dia..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Conteúdo</label>
                            <textarea
                                required
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full px-4 py-2 rounded-xl border border-border focus:ring-2 focus:ring-primary/20 outline-none min-h-[150px]"
                                placeholder="Escreva livremente sobre seus sentimentos..."
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setIsCreating(false)}
                                className="px-4 py-2 text-muted-foreground hover:bg-muted rounded-xl"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-primary text-white rounded-xl hover:bg-primary/90"
                            >
                                Salvar Registro
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid gap-4">
                {entries.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground bg-white rounded-3xl border border-dashed">
                        <p>Nenhum registro ainda. Comece escrevendo hoje!</p>
                    </div>
                ) : (
                    entries.map((entry) => (
                        <div key={entry.id} className="bg-white p-6 rounded-3xl shadow-sm border border-border hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-10 h-10 rounded-full flex items-center justify-center bg-opacity-10"
                                        style={{ backgroundColor: `${entry.color}20` }}
                                    >
                                        {(() => {
                                            const EmotionIcon = EMOTIONS.find(e => e.id === entry.emotion)?.icon || Smile;
                                            return <EmotionIcon className="w-5 h-5" style={{ color: entry.color }} />;
                                        })()}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">{entry.title}</h3>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(entry.timestamp).toLocaleDateString('pt-BR', {
                                                day: 'numeric',
                                                month: 'long',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p className="text-muted-foreground whitespace-pre-wrap">{entry.content}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
