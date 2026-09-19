import React, { useState } from 'react';
import {
    User, Settings, Camera, Edit2, Check, ShieldCheck, Trophy,
    Flame, Target, Zap, Dumbbell, Star, Calendar, Mail, Sparkles, Sliders,
    Activity, Shield
} from 'lucide-react';
import GithubCommitGraph from '../components/GithubCommitGraph';
import { updateProfile } from '../services/api';

const PRESET_AVATARS = [
    { id: 'athlete', label: 'Athlete', icon: Zap },
    { id: 'lifter', label: 'Lifter', icon: Dumbbell },
    { id: 'runner', label: 'Runner', icon: Activity },
    { id: 'ninja', label: 'Ninja', icon: Shield },
    { id: 'beast', label: 'Beast', icon: Trophy },
    { id: 'cyber', label: 'Cyber', icon: Sparkles },
];

const AVATAR_BG_COLORS = [
    '#3B82F6', '#10B981', '#38BDF8', '#8B5CF6', '#EC4899', '#64748B'
];

export default function ProfilePage({ profile, logs = [], badges = [], onRefreshData, onOpenSettings }) {
    const [isEditingName, setIsEditingName] = useState(false);
    const [name, setName] = useState(profile?.name || 'Athlete');
    const [avatarPreset, setAvatarPreset] = useState(profile?.avatarPreset || 'athlete');
    const [avatarBg, setAvatarBg] = useState(profile?.avatarBg === '#FFA116' ? '#3B82F6' : (profile?.avatarBg || '#3B82F6'));
    const [customAvatarUrl, setCustomAvatarUrl] = useState(profile?.avatarUrl || '');
    const [saving, setSaving] = useState(false);
    const [showAvatarPicker, setShowAvatarPicker] = useState(false);

    const completedLogs = logs.filter((l) => l.workoutDayCompleted);
    const completedDaysCount = completedLogs.length;

    const handleSaveBasicProfile = async () => {
        if (!profile?._id || saving) return;
        setSaving(true);
        try {
            await updateProfile(profile._id, {
                name,
                avatarPreset,
                avatarBg,
                avatarUrl: customAvatarUrl || undefined,
            });
            await onRefreshData();
            setIsEditingName(false);
            setShowAvatarPicker(false);
        } catch (err) {
            console.error('Failed to update profile basic info:', err);
        } finally {
            setSaving(false);
        }
    };

    const currentPresetObj = PRESET_AVATARS.find((a) => a.id === avatarPreset) || PRESET_AVATARS[0];

    const achievementList = [
        { id: 'first_workout', label: 'First Workout', desc: 'Completed 1st session', icon: Zap, earned: completedDaysCount >= 1 },
        { id: 'streak_5', label: '5-Day Streak', desc: 'Active for 5 straight days', icon: Flame, earned: completedDaysCount >= 5 },
        { id: 'goal_setter', label: 'Goal Setter', desc: 'Initialized goal targets', icon: Target, earned: Boolean(profile?.goal) },
        { id: 'consistent', label: 'Consistent Athlete', desc: 'Finished 10+ workouts', icon: Star, earned: completedDaysCount >= 10 },
        { id: 'beast_mode', label: 'Beast Mode', desc: 'Finished 25+ workouts', icon: Trophy, earned: completedDaysCount >= 25 },
        ...badges.map((b) => ({
            id: b._id || b.name,
            label: b.name || b.label,
            desc: b.description || 'Achievement unlocked',
            icon: Trophy,
            earned: true,
        })),
    ];

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Header Card with Avatar & Name */}
            <div className="bg-surface border border-surface-border rounded-xl p-5 sm:p-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        {/* Profile Avatar Container */}
                        <div className="relative group cursor-pointer" onClick={() => setShowAvatarPicker(!showAvatarPicker)}>
                            {customAvatarUrl ? (
                                <img
                                    src={customAvatarUrl}
                                    alt={profile?.name}
                                    className="w-16 h-16 rounded-xl object-cover border-2 border-surface-border group-hover:border-accent transition-colors"
                                />
                            ) : (
                                <div
                                    style={{ backgroundColor: avatarBg }}
                                    className="w-16 h-16 rounded-xl flex items-center justify-center text-bg text-2xl font-bold font-mono border-2 border-surface-border group-hover:border-accent transition-colors shadow-subtle"
                                >
                                    {profile?.name ? profile.name.charAt(0).toUpperCase() : 'A'}
                                </div>
                            )}
                            <div className="absolute -bottom-1 -right-1 bg-surface border border-surface-border rounded-md p-1 text-text-muted group-hover:text-accent transition-colors">
                                <Camera className="w-3 h-3" />
                            </div>
                        </div>

                        {/* Name & Account Metadata */}
                        <div>
                            {isEditingName ? (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="bg-bg border border-accent rounded-lg px-2.5 py-1 text-sm text-text-main font-bold focus:outline-none"
                                    />
                                    <button
                                        onClick={handleSaveBasicProfile}
                                        disabled={saving}
                                        className="p-1.5 bg-accent text-bg rounded-lg hover:bg-accent-hover font-bold text-xs"
                                    >
                                        <Check className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <h1 className="text-xl font-bold text-text-main">{profile?.name || 'Athlete'}</h1>
                                    <button
                                        onClick={() => setIsEditingName(true)}
                                        className="p-1 text-text-muted hover:text-text-main rounded transition-colors"
                                        title="Edit Name"
                                    >
                                        <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            )}

                            <div className="flex flex-wrap items-center gap-2.5 text-xs text-text-muted mt-1 font-mono">
                                <span>{profile?.email || 'Local Athlete Session'}</span>
                                <span>•</span>
                                <span className="uppercase text-accent font-semibold">{profile?.trainingStyle || 'STRENGTH'}</span>
                                <span>•</span>
                                <span className="uppercase text-text-secondary">{profile?.goal || 'CUT'} PHASE</span>
                            </div>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 self-start sm:self-auto">
                        <button
                            onClick={onOpenSettings}
                            className="px-3 py-1.5 bg-surface-hover hover:bg-surface-elevated text-text-main border border-surface-border rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                            <Settings className="w-3.5 h-3.5 text-accent" />
                            <span>Settings & Preferences</span>
                        </button>
                    </div>
                </div>

                {/* Avatar Picker Panel */}
                {showAvatarPicker && (
                    <div className="pt-4 border-t border-surface-border space-y-3 animate-fadeIn">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-text-muted uppercase">Customize Avatar Color & URL</span>
                            <button
                                onClick={handleSaveBasicProfile}
                                disabled={saving}
                                className="px-3 py-1 bg-accent text-bg rounded-md font-semibold text-xs hover:bg-accent-hover"
                            >
                                {saving ? 'Saving...' : 'Save Avatar'}
                            </button>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-[11px] text-text-muted">Avatar Color Accent</label>
                            <div className="flex items-center gap-2">
                                {AVATAR_BG_COLORS.map((c) => (
                                    <button
                                        key={c}
                                        onClick={() => setAvatarBg(c)}
                                        style={{ backgroundColor: c }}
                                        className={`w-6 h-6 rounded-full transition-transform ${avatarBg === c ? 'scale-125 ring-2 ring-text-main' : 'opacity-70 hover:opacity-100'}`}
                                    />
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-[11px] text-text-muted mb-1">Custom Image URL (Optional)</label>
                            <input
                                type="url"
                                placeholder="https://images.unsplash.com/photo-..."
                                value={customAvatarUrl}
                                onChange={(e) => setCustomAvatarUrl(e.target.value)}
                                className="w-full bg-bg border border-surface-border rounded-lg px-3 py-1.5 text-xs text-text-main focus:outline-none focus:border-accent"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* GitHub Commits Style Workout Activity Heatmap */}
            <GithubCommitGraph logs={logs} />

            {/* Badges & Achievements Grid */}
            <div className="bg-surface border border-surface-border rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-surface-border pb-3">
                    <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-accent" />
                        <h3 className="font-semibold text-xs text-text-main">Badges & Achievements</h3>
                    </div>
                    <span className="text-[11px] font-mono text-text-muted">
                        {achievementList.filter((a) => a.earned).length} / {achievementList.length} Unlocked
                    </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {achievementList.map((badge) => {
                        const Icon = badge.icon;
                        return (
                            <div
                                key={badge.id}
                                className={`p-3 rounded-xl border flex flex-col items-center text-center transition-all ${badge.earned
                                    ? 'bg-surface-hover/80 border-accent/30 text-text-main'
                                    : 'bg-bg/40 border-surface-border/40 text-text-muted opacity-40'
                                    }`}
                            >
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2 ${badge.earned ? 'bg-accent/15 text-accent border border-accent/30' : 'bg-surface-border/30 text-text-muted'
                                    }`}>
                                    <Icon className="w-4.5 h-4.5" />
                                </div>
                                <span className="text-xs font-semibold truncate w-full">{badge.label}</span>
                                <span className="text-[10px] text-text-muted mt-0.5 leading-tight line-clamp-2">{badge.desc}</span>
                                <span className={`mt-2 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${badge.earned ? 'bg-success/15 text-success border border-success/30' : 'bg-surface-border/40 text-text-muted'
                                    }`}>
                                    {badge.earned ? 'Unlocked' : 'Locked'}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
