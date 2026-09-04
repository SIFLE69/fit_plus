import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Check, AlertCircle, Shield } from 'lucide-react';

export default function OnboardingForm({ onSubmitProfile, loading }) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        age: 25,
        gender: 'male',
        weightKg: 75,
        heightCm: 175,
        goal: 'cut',
        activityLevel: 'moderate',
        trainingStyle: 'strength',
        conditionsInput: '',
    });

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleNext = () => {
        if (step === 1 && !formData.name.trim()) return;
        if (step < 4) setStep(step + 1);
    };

    const handlePrev = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const conditions = formData.conditionsInput
            ? formData.conditionsInput.split(',').map((c) => c.trim()).filter(Boolean)
            : [];

        onSubmitProfile({
            name: formData.name.trim() || 'Athlete',
            age: Number(formData.age),
            gender: formData.gender,
            weightKg: Number(formData.weightKg),
            heightCm: Number(formData.heightCm),
            goal: formData.goal,
            activityLevel: formData.activityLevel,
            trainingStyle: formData.trainingStyle,
            conditions,
        });
    };

    return (
        <div className="min-h-[85vh] flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-surface border border-surface-border rounded-xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                {/* Progress Bar & Dots */}
                <div className="mb-8">
                    <div className="flex items-center justify-between text-xs text-text-muted mb-2 font-display">
                        <span>STEP {step} OF 4</span>
                        <span>{step === 1 ? 'PROFILE' : step === 2 ? 'METRICS' : step === 3 ? 'OBJECTIVE' : 'TRAINING'}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className={`h-1.5 rounded-full transition-all duration-300 ${i <= step ? 'bg-accent' : 'bg-surface-border'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* STEP 1: Name, Age, Gender */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-display font-bold text-text-main">Welcome to FitPlan</h2>
                                <p className="text-sm text-text-muted mt-1">Let's build your custom macro & workout system.</p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-text-muted uppercase mb-1">Athlete Name</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Alex Vance"
                                        value={formData.name}
                                        onChange={(e) => handleChange('name', e.target.value)}
                                        className="w-full bg-bg border border-surface-border rounded-lg px-4 py-3 text-text-main placeholder:text-text-muted/50 focus:outline-none focus:border-accent"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-text-muted uppercase mb-1">Age</label>
                                        <input
                                            type="number"
                                            min="14"
                                            max="90"
                                            value={formData.age}
                                            onChange={(e) => handleChange('age', e.target.value)}
                                            className="w-full bg-bg border border-surface-border rounded-lg px-4 py-3 text-text-main focus:outline-none focus:border-accent num-tabular font-display"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-text-muted uppercase mb-1">Gender</label>
                                        <select
                                            value={formData.gender}
                                            onChange={(e) => handleChange('gender', e.target.value)}
                                            className="w-full bg-bg border border-surface-border rounded-lg px-4 py-3 text-text-main focus:outline-none focus:border-accent"
                                        >
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other / Neutral</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: Physical Metrics */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-display font-bold text-text-main">Physical Baseline</h2>
                                <p className="text-sm text-text-muted mt-1">Required for accurate Mifflin-St Jeor BMR calculation.</p>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-xs font-semibold text-text-muted uppercase">Body Weight</span>
                                        <span className="font-display font-bold text-accent">{formData.weightKg} kg</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="40"
                                        max="180"
                                        step="0.5"
                                        value={formData.weightKg}
                                        onChange={(e) => handleChange('weightKg', e.target.value)}
                                        className="w-full accent-accent bg-surface-border h-2 rounded-lg cursor-pointer"
                                    />
                                    <div className="flex justify-between text-[11px] text-text-muted mt-1">
                                        <span>40 kg</span>
                                        <span>110 kg</span>
                                        <span>180 kg</span>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-xs font-semibold text-text-muted uppercase">Height</span>
                                        <span className="font-display font-bold text-accent">{formData.heightCm} cm</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="140"
                                        max="220"
                                        value={formData.heightCm}
                                        onChange={(e) => handleChange('heightCm', e.target.value)}
                                        className="w-full accent-accent bg-surface-border h-2 rounded-lg cursor-pointer"
                                    />
                                    <div className="flex justify-between text-[11px] text-text-muted mt-1">
                                        <span>140 cm</span>
                                        <span>180 cm</span>
                                        <span>220 cm</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: Goal & Activity Level */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-display font-bold text-text-main">Primary Goal & Routine</h2>
                                <p className="text-sm text-text-muted mt-1">Determines target calorie surplus/deficit and macro splits.</p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-text-muted uppercase mb-2">Primary Goal</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { id: 'cut', title: 'Cut', desc: '-500 kcal' },
                                            { id: 'maintain', title: 'Maintain', desc: 'TDEE' },
                                            { id: 'bulk', title: 'Bulk', desc: '+300 kcal' },
                                        ].map((g) => (
                                            <button
                                                type="button"
                                                key={g.id}
                                                onClick={() => handleChange('goal', g.id)}
                                                className={`p-3 rounded-lg border text-left transition-all ${formData.goal === g.id
                                                        ? 'border-accent bg-accent/10 text-text-main'
                                                        : 'border-surface-border bg-bg text-text-muted hover:text-text-main'
                                                    }`}
                                            >
                                                <div className="font-display font-bold text-sm">{g.title}</div>
                                                <div className="text-[11px] opacity-75">{g.desc}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-text-muted uppercase mb-1">Daily Activity Level</label>
                                    <select
                                        value={formData.activityLevel}
                                        onChange={(e) => handleChange('activityLevel', e.target.value)}
                                        className="w-full bg-bg border border-surface-border rounded-lg px-4 py-3 text-text-main focus:outline-none focus:border-accent text-sm"
                                    >
                                        <option value="sedentary">Sedentary (Desk job, minimal movement)</option>
                                        <option value="light">Light Active (1-3 workouts per week)</option>
                                        <option value="moderate">Moderate Active (3-5 workouts per week)</option>
                                        <option value="active">Active (6-7 workouts per week)</option>
                                        <option value="very_active">Very Active (Heavy manual job / 2x workouts)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 4: Training Style & Conditions */}
                    {step === 4 && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-display font-bold text-text-main">Training Setup</h2>
                                <p className="text-sm text-text-muted mt-1">Rule-based generator will construct split based on your preferences.</p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-text-muted uppercase mb-2">Training Style</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { id: 'strength', title: 'Strength', desc: 'Hypertrophy' },
                                            { id: 'cardio', title: 'Cardio', desc: 'Endurance' },
                                            { id: 'mix', title: 'Hybrid Mix', desc: 'Balanced' },
                                        ].map((s) => (
                                            <button
                                                type="button"
                                                key={s.id}
                                                onClick={() => handleChange('trainingStyle', s.id)}
                                                className={`p-3 rounded-lg border text-left transition-all ${formData.trainingStyle === s.id
                                                        ? 'border-accent bg-accent/10 text-text-main'
                                                        : 'border-surface-border bg-bg text-text-muted hover:text-text-main'
                                                    }`}
                                            >
                                                <div className="font-display font-bold text-sm">{s.title}</div>
                                                <div className="text-[11px] opacity-75">{s.desc}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-text-muted uppercase mb-1">
                                        Injuries or Conditions (Comma separated)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. knee pain, lower back injury"
                                        value={formData.conditionsInput}
                                        onChange={(e) => handleChange('conditionsInput', e.target.value)}
                                        className="w-full bg-bg border border-surface-border rounded-lg px-4 py-3 text-text-main placeholder:text-text-muted/50 focus:outline-none focus:border-accent text-sm"
                                    />
                                    <p className="text-[11px] text-text-muted mt-1 flex items-center gap-1">
                                        <Shield className="w-3 h-3 text-accent inline" /> Rules will automatically filter out incompatible exercise categories.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation Controls */}
                    <div className="mt-8 flex items-center justify-between gap-4 pt-4 border-t border-surface-border">
                        {step > 1 ? (
                            <button
                                type="button"
                                onClick={handlePrev}
                                className="px-4 py-2.5 rounded-lg border border-surface-border text-text-muted hover:text-text-main flex items-center gap-1 text-sm font-semibold min-h-[44px]"
                            >
                                <ArrowLeft className="w-4 h-4" /> Back
                            </button>
                        ) : <div />}

                        {step < 4 ? (
                            <button
                                type="button"
                                onClick={handleNext}
                                disabled={step === 1 && !formData.name.trim()}
                                className="px-6 py-2.5 rounded-lg bg-accent text-bg hover:bg-accent-hover disabled:opacity-50 flex items-center gap-2 text-sm font-bold font-display min-h-[44px] transition-colors"
                            >
                                Next Step <ArrowRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2.5 rounded-lg bg-accent text-bg hover:bg-accent-hover disabled:opacity-50 flex items-center gap-2 text-sm font-bold font-display min-h-[44px] transition-colors"
                            >
                                {loading ? 'Building System...' : 'Generate FitPlan'} <Check className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
