'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import PomodoroTimer from '@/components/focus/PomodoroTimer';
import { Brain } from 'lucide-react';

export default function FocusPage() {
    const { user } = useAuth();
    const router = useRouter();

    if (user?.goal !== 'focus') {
        return (
            <div className="max-w-2xl mx-auto text-center py-12">
                <Brain className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-2xl font-bold mb-2">Área de Foco</h2>
                <p className="text-muted-foreground mb-6">
                    Esta área é exclusiva para usuários com objetivo "Aumentar o Foco".
                </p>
                <button
                    onClick={() => router.push('/dashboard')}
                    className="px-6 py-2 bg-primary text-white rounded-xl hover:bg-primary/90"
                >
                    Voltar ao Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Modo Foco</h1>
                <p className="text-muted-foreground">Ferramentas para aumentar sua concentração e produtividade.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PomodoroTimer />

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-border">
                    <h3 className="text-xl font-bold mb-4">Lista de Distrações</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        Anote pensamentos que surgirem durante o foco para não perdê-los.
                    </p>
                    <textarea
                        className="w-full px-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-primary/20 outline-none min-h-[200px]"
                        placeholder="Ex: Lembrar de ligar para Maria às 15h..."
                    />
                    <button className="mt-3 w-full py-2 bg-primary text-white rounded-xl hover:bg-primary/90">
                        Salvar
                    </button>
                </div>
            </div>

            {user?.plan === 'premium' && (
                <div className="bg-gradient-to-r from-primary/10 to-blue-500/10 p-6 rounded-3xl border border-primary/20">
                    <h3 className="font-bold text-lg mb-2">🌟 Recursos Premium Ativos</h3>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>✓ Relatórios avançados de foco</li>
                        <li>✓ Bloqueio inteligente de distrações</li>
                        <li>✓ Playlists exclusivas de concentração</li>
                    </ul>
                </div>
            )}
        </div>
    );
}
