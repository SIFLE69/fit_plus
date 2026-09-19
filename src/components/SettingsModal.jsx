import React, { useState, useEffect } from 'react';
import { X, Settings, Palette, User, Save, Check, Sun } from 'lucide-react';
import { updateProfile } from '../services/api';

const ACCENT_THEMES = [
    { id: 'sky', label: 'Sky Blue', light: '#38BDF8', lightHover: '#0EA5E9' },
    { id: 'green', label: 'Light Green', light: '#4ADE80', lightHover: '#22C55E' },
    { id: 'teal', label: 'Teal Blue-Green', light: '#2DD4BF', lightHover: '#14B8A6' },
    { id: 'blue', label: 'Calm Blue', light: '#60A5FA', lightHover: '#3B82F6' },
    { id: 'mint', label: 'Mint Green', light: '#6EE7B7', lightHover: '#34D399' },
];

export default function SettingsModal({ profile, isOpen, onClose, onRefreshData }) {
    if (!isOpen || !profile) return null;

    const [activeTab, setActiveTab] = useState('appearance');

    // Basic Settings state
    const [name, setName] = useState(profile.name || '');
    const [age, setAge] = useState(profile.age || 26);
    const [weightKg, setWeightKg] = useState(profile.weightKg || 75);
    const [heightCm, setHeightCm] = useState(profile.heightCm || 175);
    const [goal, setGoal] = useState(profile.goal || 'cut');
    const [trainingStyle, setTrainingStyle] = useState(profile.trainingStyle || 'strength');
    const [saving, setSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    // Appearance tab state
    const [accentPreset, setAccentPreset] = useState(profile.accentPreset || 'sky');
    const [density, setDensity] = useState(profile.density || 'comfortable');

    // Apply theme on component mount or state change
    const applyThemeToDOM = (accentId) => {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('fitcode_theme', 'light');

        const themeObj = ACCENT_THEMES.find((t) => t.id === accentId) || ACCENT_THEMES[0];
        document.documentElement.style.setProperty('--accent', themeObj.light);
        document.documentElement.style.setProperty('--accent-hover', themeObj.lightHover);
    };

    useEffect(() => {
        applyThemeToDOM(accentPreset);
    }, [accentPreset]);

    const handleAccentChange = (presetId) => {
        setAccentPreset(presetId);
        applyThemeToDOM(presetId);
    };

    const handleSaveSettings = async (e) => {
        e.preventDefault();
        if (!profile._id || saving) return;
        setSaving(true);
        try {
            await updateProfile(profile._id, {
                name,
                age: Number(age),
                weightKg: Number(weightKg),
                heightCm: Number(heightCm),
                goal,
                trainingStyle,
                themeMode: 'light',
                accentPreset,
                density,
            });

            await onRefreshData();
            setSuccessMsg('Settings saved successfully!');
            setTimeout(() => setSuccessMsg(''), 2500);
        } catch (err) {
            console.error('Failed to save settings:', err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-surface rounded-xl max-w-xl w-full p-5 sm:p-6 shadow-card space-y-5 animate-fadeIn">
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-surface-hover pb-3">
                    <div className="flex items-center gap-2">
                        <Settings className="w-4 h-4 text-accent" />
                        <h2 className="font-bold text-base text-text-main">Settings & Customization</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 text-text-muted hover:text-text-main rounded-md hover:bg-surface-hover transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Sub Tab Navigation */}
                <div className="flex items-center gap-2 border-b border-surface-hover pb-2">
                    <button
                        onClick={() => setActiveTab('appearance')}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${activeTab === 'appearance'
                            ? 'bg-accent/15 text-accent font-bold'
                            : 'text-text-muted hover:text-text-main hover:bg-surface-hover'
                            }`}
                    >
                        <Palette className="w-3.5 h-3.5" /> Appearance
                    </button>

                    <button
                        onClick={() => setActiveTab('basic')}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${activeTab === 'basic'
                            ? 'bg-accent/15 text-accent font-bold'
                            : 'text-text-muted hover:text-text-main hover:bg-surface-hover'
                            }`}
                    >
                        <User className="w-3.5 h-3.5" /> Basic Settings
                    </button>
                </div>

                {successMsg && (
                    <div className="p-2.5 bg-success/15 text-success rounded-lg text-xs font-semibold flex items-center gap-2">
                        <Check className="w-4 h-4" /> {successMsg}
                    </div>
                )}

                <form onSubmit={handleSaveSettings} className="space-y-4">
                    {/* TAB 1: APPEARANCE SETTINGS */}
                    {activeTab === 'appearance' && (
                        <div className="space-y-5">
                            {/* Light Mode Active Indicator */}
                            <div>
                                <label className="block text-[11px] text-text-muted mb-2 font-semibold uppercase">Application Theme</label>
                                <div className="p-3 bg-accent/10 rounded-xl flex items-center gap-3">
                                    <Sun className="w-5 h-5 text-accent shrink-0" />
                                    <div>
                                        <span className="text-xs font-bold text-text-main block">Clean Light Mode Active</span>
                                        <span className="text-[11px] text-text-muted">Pure white & soft slate design system.</span>
                                    </div>
                                </div>
                            </div>

                            {/* Accent Theme Colors */}
                            <div>
                                <label className="block text-[11px] text-text-muted mb-2 font-semibold uppercase">Accent Palette</label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {ACCENT_THEMES.map((theme) => (
                                        <button
                                            key={theme.id}
                                            type="button"
                                            onClick={() => handleAccentChange(theme.id)}
                                            className={`p-2.5 rounded-lg border text-left flex items-center gap-2.5 transition-all ${accentPreset === theme.id
                                                ? 'border-accent bg-accent/10 font-bold text-text-main'
                                                : 'border-surface-hover bg-bg hover:bg-surface-hover text-text-muted'
                                                }`}
                                        >
                                            <div style={{ backgroundColor: theme.light }} className="w-4 h-4 rounded-full shrink-0 shadow-sm" />
                                            <span className="text-xs truncate">{theme.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Density option */}
                            <div>
                                <label className="block text-[11px] text-text-muted mb-2 font-semibold uppercase">Layout Density</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { id: 'comfortable', label: 'Comfortable Spacing' },
                                        { id: 'compact', label: 'Compact Telemetry' },
                                    ].map((d) => (
                                        <button
                                            key={d.id}
                                            type="button"
                                            onClick={() => setDensity(d.id)}
                                            className={`p-2.5 rounded-lg border text-center transition-all ${density === d.id
                                                ? 'border-accent bg-accent/10 font-bold text-text-main'
                                                : 'border-surface-hover bg-bg hover:bg-surface-hover text-text-muted'
                                                }`}
                                        >
                                            <span className="text-xs block">{d.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 2: BASIC SETTINGS */}
                    {activeTab === 'basic' && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[11px] text-text-muted mb-1 font-semibold">Athlete Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-bg border border-surface-hover rounded-lg px-3 py-1.5 text-xs text-text-main focus:outline-none focus:border-accent"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] text-text-muted mb-1 font-semibold">Age (Years)</label>
                                    <input
                                        type="number"
                                        value={age}
                                        onChange={(e) => setAge(e.target.value)}
                                        className="w-full bg-bg border border-surface-hover rounded-lg px-3 py-1.5 text-xs text-text-main focus:outline-none focus:border-accent font-mono"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] text-text-muted mb-1 font-semibold">Body Weight (kg)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={weightKg}
                                        onChange={(e) => setWeightKg(e.target.value)}
                                        className="w-full bg-bg border border-surface-hover rounded-lg px-3 py-1.5 text-xs text-text-main focus:outline-none focus:border-accent font-mono"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] text-text-muted mb-1 font-semibold">Height (cm)</label>
                                    <input
                                        type="number"
                                        value={heightCm}
                                        onChange={(e) => setHeightCm(e.target.value)}
                                        className="w-full bg-bg border border-surface-hover rounded-lg px-3 py-1.5 text-xs text-text-main focus:outline-none focus:border-accent font-mono"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                <div>
                                    <label className="block text-[11px] text-text-muted mb-1 font-semibold uppercase">Nutrition Goal</label>
                                    <select
                                        value={goal}
                                        onChange={(e) => setGoal(e.target.value)}
                                        className="w-full bg-bg border border-surface-hover rounded-lg px-3 py-1.5 text-xs text-text-main focus:outline-none focus:border-accent capitalize"
                                    >
                                        <option value="cut">Fat Loss (Cut)</option>
                                        <option value="maintain">Recomposition (Maintain)</option>
                                        <option value="bulk">Muscle Gain (Bulk)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[11px] text-text-muted mb-1 font-semibold uppercase">Training Discipline</label>
                                    <select
                                        value={trainingStyle}
                                        onChange={(e) => setTrainingStyle(e.target.value)}
                                        className="w-full bg-bg border border-surface-hover rounded-lg px-3 py-1.5 text-xs text-text-main focus:outline-none focus:border-accent capitalize"
                                    >
                                        <option value="strength">Gym & Weightlifting</option>
                                        <option value="calisthenics">Calisthenics & Bodyweight</option>
                                        <option value="cardio">Cardio & HIIT Endurance</option>
                                        <option value="hybrid">Hybrid Conditioning</option>
                                        <option value="functional">Functional & Core</option>
                                        <option value="powerlifting">Powerlifting (5x5)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Footer Controls */}
                    <div className="pt-3 border-t border-surface-hover flex items-center justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-text-muted hover:text-text-main hover:bg-surface-hover transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-4 py-1.5 bg-accent text-bg hover:bg-accent-hover rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                            <Save className="w-3.5 h-3.5" />
                            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
