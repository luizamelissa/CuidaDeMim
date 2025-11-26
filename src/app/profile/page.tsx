'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Camera, User, Mail, Calendar, Target, Crown, Edit2, Save, X } from 'lucide-react';

export default function ProfilePage() {
    const { user, updateProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Form state
    const [displayName, setDisplayName] = useState(user?.displayName || '');
    const [bio, setBio] = useState(user?.bio || '');
    const [photoURL, setPhotoURL] = useState(user?.photoURL || '');

    const handleSave = async () => {
        if (!user) return;

        setIsSaving(true);
        try {
            await updateProfile({
                displayName,
                bio,
                photoURL
            });
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Erro ao salvar perfil. Tente novamente.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setDisplayName(user?.displayName || '');
        setBio(user?.bio || '');
        setPhotoURL(user?.photoURL || '');
        setIsEditing(false);
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoURL(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const simulatePremium = async () => {
        if (!user) return;
        const newPlan = user.plan === 'premium' ? 'basic' : 'premium';
        await updateProfile({ plan: newPlan });
    };

    const goalLabels = {
        anxiety: 'Reduzir Ansiedade',
        focus: 'Aumentar Foco',
        productivity: 'Organizar o Dia'
    };

    if (!user) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Meu Perfil</h1>
                    <p className="text-muted-foreground">Gerencie suas informações pessoais</p>
                </div>
                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 flex items-center gap-2"
                    >
                        <Edit2 className="w-4 h-4" />
                        Editar Perfil
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button
                            onClick={handleCancel}
                            className="px-4 py-2 bg-muted text-foreground rounded-xl hover:bg-muted/80 flex items-center gap-2"
                        >
                            <X className="w-4 h-4" />
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 flex items-center gap-2 disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            {isSaving ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>
                )}
            </div>

            {/* Profile Card */}
            <div className="bg-card p-8 rounded-3xl shadow-sm border border-border">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Photo Section */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-4xl font-bold overflow-hidden">
                                {photoURL ? (
                                    <img src={photoURL} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    user.displayName?.charAt(0).toUpperCase() || <User className="w-16 h-16" />
                                )}
                            </div>
                            {isEditing && (
                                <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="w-8 h-8 text-white" />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoUpload}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>
                        {isEditing && (
                            <p className="text-xs text-muted-foreground text-center">
                                Clique na foto para alterar
                            </p>
                        )}
                    </div>

                    {/* Info Section */}
                    <div className="flex-1 space-y-6">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Nome</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    className="w-full px-4 py-2 rounded-xl border border-border focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder="Seu nome"
                                />
                            ) : (
                                <div className="flex items-center gap-2 text-lg">
                                    <User className="w-5 h-5 text-muted-foreground" />
                                    <span className="font-semibold">{user.displayName || 'Não informado'}</span>
                                </div>
                            )}
                        </div>

                        {/* Bio */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Sobre você</label>
                            {isEditing ? (
                                <textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    className="w-full px-4 py-2 rounded-xl border border-border focus:ring-2 focus:ring-primary/20 outline-none min-h-[100px]"
                                    placeholder="Conte um pouco sobre você..."
                                />
                            ) : (
                                <p className="text-muted-foreground">
                                    {user.bio || 'Nenhuma descrição adicionada ainda.'}
                                </p>
                            )}
                        </div>

                        {/* Email (read-only) */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Email</label>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Mail className="w-5 h-5" />
                                <span>{user.email}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Additional Info */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Account Info */}
                <div className="bg-card p-6 rounded-3xl shadow-sm border border-border">
                    <h3 className="text-xl font-bold mb-4">Informações da Conta</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-muted-foreground" />
                                <span className="text-sm">Faixa Etária</span>
                            </div>
                            <span className="font-semibold">{user.ageRange || 'Não informado'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Target className="w-5 h-5 text-muted-foreground" />
                                <span className="text-sm">Objetivo</span>
                            </div>
                            <span className="font-semibold">
                                {user.goal ? goalLabels[user.goal] : 'Não definido'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Crown className="w-5 h-5 text-muted-foreground" />
                                <span className="text-sm">Plano</span>
                            </div>
                            <span className={`font-semibold ${user.plan === 'premium' ? 'text-primary' : ''}`}>
                                {user.plan === 'premium' ? 'Premium ✨' : 'Básico'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Subscription */}
                <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-6 rounded-3xl border border-primary/20">
                    <h3 className="text-xl font-bold mb-2">Assinatura</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        {user.plan === 'premium'
                            ? 'Você tem acesso a todos os recursos premium!'
                            : 'Faça upgrade para desbloquear recursos exclusivos'}
                    </p>
                    <div className="space-y-2">
                        {user.plan === 'basic' ? (
                            <>
                                <button
                                    onClick={simulatePremium}
                                    className="w-full py-2 bg-primary text-white rounded-xl hover:bg-primary/90 font-semibold"
                                >
                                    Simular Premium (24h)
                                </button>
                                <button className="w-full py-2 bg-card border border-border text-foreground rounded-xl hover:bg-muted">
                                    Ver Planos
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="bg-card p-4 rounded-xl">
                                    <p className="text-sm font-medium mb-1">Status</p>
                                    <p className="text-xs text-muted-foreground">Ativo desde {new Date(user.createdAt).toLocaleDateString('pt-BR')}</p>
                                </div>
                                <button
                                    onClick={simulatePremium}
                                    className="w-full py-2 bg-card border border-border text-foreground rounded-xl hover:bg-muted text-sm"
                                >
                                    Voltar para Básico
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-6 rounded-3xl border border-border">
                <h3 className="text-xl font-bold mb-4">Estatísticas</h3>
                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-primary">{user.level}</div>
                        <div className="text-sm text-muted-foreground">Nível</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-secondary">{user.xp}</div>
                        <div className="text-sm text-muted-foreground">XP</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-purple-500">{user.badges.length}</div>
                        <div className="text-sm text-muted-foreground">Conquistas</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
