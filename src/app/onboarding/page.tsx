'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { UserGoal } from '@/types';
import { Loader2, ArrowRight, Check } from 'lucide-react';

export default function OnboardingPage() {
    const { user, updateProfile } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState('');
    const [ageRange, setAgeRange] = useState('');
    const [goal, setGoal] = useState<UserGoal | ''>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!goal) return;

        setLoading(true);
        try {
            await updateProfile({
                displayName: name,
                ageRange,
                goal: goal as UserGoal
            });
            router.push('/dashboard');
        } catch (error) {
            console.error('Onboarding error:', error);
        } finally {
            setLoading(false);
        }
    };

    const goals: { id: UserGoal; label: string; desc: string }[] = [
        { id: 'anxiety', label: 'Reduzir Ansiedade', desc: 'Quero me sentir mais calmo e no controle.' },
        { id: 'focus', label: 'Aumentar Foco', desc: 'Preciso me concentrar melhor nas tarefas.' },
        { id: 'productivity', label: 'Organizar o Dia', desc: 'Quero ser mais produtivo e organizado.' },
    ];

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-12">
            <div className="w-full max-w-2xl bg-background p-8 rounded-3xl shadow-xl border border-border">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold mb-3">Vamos personalizar sua experiência</h1>
                    <p className="text-muted-foreground">Responda algumas perguntas rápidas para começarmos.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Name */}
                    <div className="space-y-3">
                        <label className="block text-lg font-medium">Como você gostaria de ser chamado?</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-5 py-3 text-lg rounded-xl border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            placeholder="Seu nome"
                        />
                    </div>

                    {/* Age Range */}
                    <div className="space-y-3">
                        <label className="block text-lg font-medium">Qual sua faixa etária?</label>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                            {['< 18', '18-24', '25-34', '35-44', '45+'].map((range) => (
                                <button
                                    key={range}
                                    type="button"
                                    onClick={() => setAgeRange(range)}
                                    className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all ${ageRange === range
                                            ? 'bg-primary text-white border-primary shadow-md'
                                            : 'bg-background border-border hover:border-primary/50'
                                        }`}
                                >
                                    {range}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Goal */}
                    <div className="space-y-3">
                        <label className="block text-lg font-medium">Qual seu principal objetivo?</label>
                        <div className="grid sm:grid-cols-1 gap-4">
                            {goals.map((g) => (
                                <button
                                    key={g.id}
                                    type="button"
                                    onClick={() => setGoal(g.id)}
                                    className={`p-4 rounded-xl border text-left transition-all flex items-center gap-4 ${goal === g.id
                                            ? 'bg-primary/5 border-primary ring-1 ring-primary'
                                            : 'bg-background border-border hover:border-primary/50 hover:bg-muted/50'
                                        }`}
                                >
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${goal === g.id ? 'border-primary bg-primary text-white' : 'border-muted-foreground'
                                        }`}>
                                        {goal === g.id && <Check className="w-3 h-3" />}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-lg">{g.label}</div>
                                        <div className="text-muted-foreground text-sm">{g.desc}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !name || !ageRange || !goal}
                        className="w-full py-4 bg-primary text-white text-lg font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-8"
                    >
                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Continuar <ArrowRight className="w-5 h-5" /></>}
                    </button>
                </form>
            </div>
        </div>
    );
}
