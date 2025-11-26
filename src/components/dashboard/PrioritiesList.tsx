'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { dbService } from '@/services';
import { PriorityItem } from '@/types';
import { Plus, Check, Trash2, Loader2 } from 'lucide-react';

export default function PrioritiesList() {
    const { user } = useAuth();
    const [priorities, setPriorities] = useState<PriorityItem[]>([]);
    const [newPriority, setNewPriority] = useState('');
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);

    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        if (!user) return;
        const loadPriorities = async () => {
            try {
                const data = await dbService.getPriorities(user.uid, today);
                setPriorities(data);
            } catch (error) {
                console.error('Error loading priorities:', error);
            } finally {
                setLoading(false);
            }
        };
        loadPriorities();
    }, [user, today]);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !newPriority.trim() || priorities.length >= 3) return;

        setAdding(true);
        try {
            const added = await dbService.addPriority(user.uid, newPriority, today);
            setPriorities([...priorities, added]);
            setNewPriority('');
        } catch (error) {
            console.error('Error adding priority:', error);
        } finally {
            setAdding(false);
        }
    };

    const handleToggle = async (id: string, completed: boolean) => {
        try {
            // Optimistic update
            setPriorities(priorities.map(p => p.id === id ? { ...p, completed } : p));
            await dbService.togglePriority(id, completed);
        } catch (error) {
            console.error('Error toggling priority:', error);
            // Revert on error (could be improved)
        }
    };

    const handleDelete = async (id: string) => {
        try {
            setPriorities(priorities.filter(p => p.id !== id));
            await dbService.deletePriority(id);
        } catch (error) {
            console.error('Error deleting priority:', error);
        }
    };

    if (loading) return <div className="h-48 flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;

    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-border h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold">Prioridades do Dia</h3>
                    <p className="text-muted-foreground text-sm">Foque no que importa. Máximo 3.</p>
                </div>
                <div className="bg-primary/10 text-primary font-bold px-3 py-1 rounded-full text-sm">
                    {priorities.filter(p => p.completed).length}/{priorities.length}
                </div>
            </div>

            <div className="flex-1 space-y-3 mb-4">
                {priorities.map((p) => (
                    <div
                        key={p.id}
                        className={`group flex items-center gap-3 p-3 rounded-xl border transition-all ${p.completed
                                ? 'bg-green-50 border-green-100'
                                : 'bg-background border-border hover:border-primary/30'
                            }`}
                    >
                        <button
                            onClick={() => handleToggle(p.id, !p.completed)}
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${p.completed
                                    ? 'bg-green-500 border-green-500 text-white'
                                    : 'border-muted-foreground text-transparent hover:border-primary'
                                }`}
                        >
                            <Check className="w-3 h-3" strokeWidth={3} />
                        </button>
                        <span className={`flex-1 font-medium ${p.completed ? 'text-muted-foreground line-through' : ''}`}>
                            {p.text}
                        </span>
                        <button
                            onClick={() => handleDelete(p.id)}
                            className="opacity-0 group-hover:opacity-100 p-2 text-muted-foreground hover:text-red-500 transition-all"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}

                {priorities.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-border rounded-xl">
                        Nenhuma prioridade definida ainda.
                    </div>
                )}
            </div>

            {priorities.length < 3 ? (
                <form onSubmit={handleAdd} className="flex gap-2">
                    <input
                        type="text"
                        value={newPriority}
                        onChange={(e) => setNewPriority(e.target.value)}
                        placeholder="Adicionar prioridade..."
                        className="flex-1 px-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                    <button
                        type="submit"
                        disabled={adding || !newPriority.trim()}
                        className="px-4 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                        {adding ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                    </button>
                </form>
            ) : (
                <div className="text-center text-sm text-muted-foreground bg-muted/30 p-3 rounded-xl">
                    Você atingiu o limite de 3 prioridades. Foco total!
                </div>
            )}
        </div>
    );
}
