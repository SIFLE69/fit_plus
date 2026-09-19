import React, { useState, useEffect, useRef } from 'react';
import { Pill, Bell, Plus, CheckCircle2, Circle, Clock, Trash2, AlertCircle, Volume2, Sparkles, ShieldCheck } from 'lucide-react';
import { getMedicationsApi, addMedicationApi, toggleMedicationApi, deleteMedicationApi } from '../services/api';

// Helper to play web audio chime tone for notifications
function playReminderChime() {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.5);
    } catch (err) {
        console.warn('Could not play web audio tone:', err);
    }
}

export default function MedicationTracker({ profile }) {
    const [medications, setMedications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);

    // Form state
    const [name, setName] = useState('');
    const [dosage, setDosage] = useState('');
    const [scheduledTime, setScheduledTime] = useState('08:00');
    const [category, setCategory] = useState('prescription');
    const [instructions, setInstructions] = useState('');
    const [saving, setSaving] = useState(false);

    // Notification states
    const [permissionStatus, setPermissionStatus] = useState(
        typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'unsupported'
    );
    const [activeBanner, setActiveBanner] = useState(null);
    const triggeredMinutesRef = useRef(new Set());

    const todayStr = new Date().toISOString().split('T')[0];

    useEffect(() => {
        if (profile?._id) {
            loadMedications();
        }
    }, [profile?._id]);

    const loadMedications = async () => {
        try {
            setLoading(true);
            const data = await getMedicationsApi(profile._id);
            setMedications(data);
        } catch (err) {
            console.error('Error loading medications:', err);
        } finally {
            setLoading(false);
        }
    };

    // Request Notification permission
    const requestNotificationPermission = async () => {
        if ('Notification' in window) {
            const result = await Notification.requestPermission();
            setPermissionStatus(result);
        }
    };

    // Trigger notification manually (test or schedule match)
    const triggerMedicineReminder = (med, isTest = false) => {
        playReminderChime();

        const title = isTest ? `🔔 [TEST] Medicine Reminder: ${med.name}` : `⏰ Medicine Reminder: ${med.name}`;
        const bodyText = `Dosage: ${med.dosage}${med.instructions ? ` • ${med.instructions}` : ''}`;

        // Set visual in-app banner
        setActiveBanner({
            med,
            title,
            body: bodyText,
        });

        // Trigger native OS notification
        if ('Notification' in window && Notification.permission === 'granted') {
            try {
                new Notification(title, {
                    body: bodyText,
                    tag: `med-${med._id}-${Date.now()}`,
                });
            } catch (err) {
                console.warn('Native notification failed:', err);
            }
        }
    };

    // Check scheduled medicine reminders every 15 seconds
    useEffect(() => {
        const checkInterval = setInterval(() => {
            if (!medications || medications.length === 0) return;

            const now = new Date();
            const currentHHMM = now.toTimeString().slice(0, 5); // "08:30"
            const minuteKey = `${todayStr}-${currentHHMM}`;

            medications.forEach((med) => {
                // If scheduled time matches current HH:MM and not taken today and not triggered yet
                if (med.scheduledTime === currentHHMM && med.lastTakenDate !== todayStr) {
                    const uniqueKey = `${med._id}-${minuteKey}`;
                    if (!triggeredMinutesRef.current.has(uniqueKey)) {
                        triggeredMinutesRef.current.add(uniqueKey);
                        triggerMedicineReminder(med);
                    }
                }
            });
        }, 15000);

        return () => clearInterval(checkInterval);
    }, [medications, todayStr]);

    const handleAddMedication = async (e) => {
        e.preventDefault();
        if (!name || !dosage || !scheduledTime) return;

        setSaving(true);
        try {
            const newMed = await addMedicationApi(profile._id, {
                name,
                dosage,
                scheduledTime,
                category,
                instructions,
            });
            setMedications((prev) => [...prev, newMed]);
            setName('');
            setDosage('');
            setInstructions('');
            setShowAddForm(false);
        } catch (err) {
            console.error('Failed to add medication:', err);
        } finally {
            setSaving(false);
        }
    };

    const handleToggleTaken = async (medId) => {
        try {
            const updated = await toggleMedicationApi(profile._id, medId);
            setMedications((prev) => prev.map((m) => (m._id === medId ? updated : m)));
            if (activeBanner?.med?._id === medId) {
                setActiveBanner(null);
            }
        } catch (err) {
            console.error('Failed to toggle medication:', err);
        }
    };

    const handleDelete = async (medId) => {
        if (!window.confirm('Remove this medication from your schedule?')) return;
        try {
            await deleteMedicationApi(profile._id, medId);
            setMedications((prev) => prev.filter((m) => m._id !== medId));
        } catch (err) {
            console.error('Failed to delete medication:', err);
        }
    };

    const takenCount = medications.filter((m) => m.lastTakenDate === todayStr).length;
    const progressPct = medications.length > 0 ? Math.round((takenCount / medications.length) * 100) : 0;

    return (
        <div className="bg-surface border border-border rounded-lg p-5 space-y-5">
            {/* Header & Notification Permission Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
                <div className="flex items-center gap-2">
                    <Pill className="w-4 h-4 text-accent" />
                    <h3 className="font-semibold text-xs text-text-main uppercase tracking-wider">Medications & Reminders</h3>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    {permissionStatus === 'granted' ? (
                        <span className="text-[11px] font-display font-bold text-success bg-success/15 border border-success/30 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5" /> Live Notifications Active
                        </span>
                    ) : (
                        <button
                            onClick={requestNotificationPermission}
                            className="text-xs font-display font-bold text-bg bg-accent hover:bg-accent-hover px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                        >
                            <Bell className="w-3.5 h-3.5" /> Enable Reminders
                        </button>
                    )}
                </div>
            </div>

            {/* Active Live Alarm Popup Banner */}
            {activeBanner && (
                <div className="bg-gradient-to-r from-sky-400/20 to-accent/20 border-2 border-accent/50 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-bounce">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-accent text-bg flex items-center justify-center font-bold shrink-0">
                            <Bell className="w-5 h-5 animate-pulse" />
                        </div>
                        <div>
                            <h4 className="font-display font-bold text-sm text-text-main flex items-center gap-1.5">
                                {activeBanner.title}
                            </h4>
                            <p className="text-xs text-text-muted mt-0.5">{activeBanner.body}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button
                            onClick={() => handleToggleTaken(activeBanner.med._id)}
                            className="px-3.5 py-1.5 bg-success text-bg hover:bg-success/90 font-display font-bold text-xs rounded-lg transition-colors flex items-center gap-1 min-h-[36px]"
                        >
                            <CheckCircle2 className="w-4 h-4" /> Mark Taken Now
                        </button>
                        <button
                            onClick={() => setActiveBanner(null)}
                            className="px-2.5 py-1.5 bg-surface text-text-muted hover:text-text-main border border-surface-border text-xs rounded-lg min-h-[36px]"
                        >
                            Dismiss
                        </button>
                    </div>
                </div>
            )}

            {/* Daily Progress Tracker Bar */}
            <div className="bg-bg border border-surface-border rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                    <span className="font-display font-bold text-text-main flex items-center gap-1.5">
                        Today's Dose Adherence
                        <span className="text-text-muted font-normal">({takenCount} of {medications.length} taken)</span>
                    </span>
                    <span className="font-display font-extrabold text-accent num-tabular">{progressPct}%</span>
                </div>
                <div className="w-full bg-surface rounded-full h-2 overflow-hidden border border-surface-border">
                    <div
                        className="bg-accent h-full transition-all duration-500 rounded-full"
                        style={{ width: `${progressPct}%` }}
                    />
                </div>
            </div>

            {/* Actions: Add Medication & Test Alarm */}
            <div className="flex items-center justify-between">
                <h4 className="font-display font-bold text-sm text-text-main">Scheduled Medications</h4>
                <div className="flex items-center gap-2">
                    {medications.length > 0 && (
                        <button
                            onClick={() => triggerMedicineReminder(medications[0], true)}
                            className="px-3 py-1.5 bg-bg hover:bg-surface-hover text-accent border border-accent/30 rounded-lg text-xs font-display font-semibold transition-colors flex items-center gap-1"
                            title="Test browser notification sound and banner alert"
                        >
                            <Volume2 className="w-3.5 h-3.5" /> Test Reminder Alert
                        </button>
                    )}
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="px-3 py-1.5 bg-accent text-bg hover:bg-accent-hover font-display font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 min-h-[36px]"
                    >
                        <Plus className="w-4 h-4" /> {showAddForm ? 'Cancel' : 'Add Medication'}
                    </button>
                </div>
            </div>

            {/* Add Medication Form */}
            {showAddForm && (
                <form onSubmit={handleAddMedication} className="bg-bg border border-accent/30 rounded-xl p-4 space-y-4 animate-fadeIn">
                    <h5 className="font-display font-bold text-xs text-accent uppercase tracking-wider">
                        Log New Medication or Supplement
                    </h5>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        <div>
                            <label className="block text-[11px] font-semibold text-text-muted uppercase mb-1">Name</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Multivitamin / Metformin"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-surface border border-surface-border rounded-lg px-3 py-2 text-text-main text-xs focus:outline-none focus:border-accent"
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-semibold text-text-muted uppercase mb-1">Dosage</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. 500mg / 1 tablet / 5g"
                                value={dosage}
                                onChange={(e) => setDosage(e.target.value)}
                                className="w-full bg-surface border border-surface-border rounded-lg px-3 py-2 text-text-main text-xs focus:outline-none focus:border-accent"
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-semibold text-text-muted uppercase mb-1">Scheduled Time</label>
                            <input
                                type="time"
                                required
                                value={scheduledTime}
                                onChange={(e) => setScheduledTime(e.target.value)}
                                className="w-full bg-surface border border-surface-border rounded-lg px-3 py-2 text-text-main text-xs focus:outline-none focus:border-accent font-display"
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-semibold text-text-muted uppercase mb-1">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full bg-surface border border-surface-border rounded-lg px-3 py-2 text-text-main text-xs focus:outline-none focus:border-accent capitalize"
                            >
                                <option value="prescription">Prescription Med</option>
                                <option value="vitamin">Vitamin</option>
                                <option value="supplement">Workout Supplement</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-[11px] font-semibold text-text-muted uppercase mb-1">Special Instructions (Optional)</label>
                        <input
                            type="text"
                            placeholder="e.g. Take with 500ml water after meal"
                            value={instructions}
                            onChange={(e) => setInstructions(e.target.value)}
                            className="w-full bg-surface border border-surface-border rounded-lg px-3 py-2 text-text-main text-xs focus:outline-none focus:border-accent"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="px-4 py-2 bg-accent text-bg hover:bg-accent-hover font-display font-bold text-xs rounded-lg transition-colors"
                    >
                        {saving ? 'Saving...' : 'Save Medication & Schedule Alarm'}
                    </button>
                </form>
            )}

            {/* List of Medications */}
            {loading ? (
                <div className="text-center py-8 text-xs text-text-muted">Loading medication schedule...</div>
            ) : medications.length === 0 ? (
                <div className="bg-bg border border-surface-border rounded-xl p-8 text-center space-y-2">
                    <Pill className="w-10 h-10 text-text-muted mx-auto opacity-50" />
                    <h4 className="font-display font-bold text-sm text-text-main">No Medications Logged Yet</h4>
                    <p className="text-xs text-text-muted max-w-sm mx-auto">
                        Add your daily prescriptions, vitamins, or fitness supplements above to get automatic time reminders and adherence tracking.
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {medications.map((med) => {
                        const isTakenToday = med.lastTakenDate === todayStr;

                        return (
                            <div
                                key={med._id}
                                className={`rounded-xl border p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${isTakenToday
                                    ? 'bg-success/5 border-success/30'
                                    : 'bg-bg border-surface-border hover:border-accent/40'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => handleToggleTaken(med._id)}
                                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${isTakenToday ? 'bg-success text-bg' : 'bg-surface text-text-muted hover:text-accent'
                                            }`}
                                    >
                                        {isTakenToday ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                                    </button>

                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h5 className={`font-display font-bold text-sm ${isTakenToday ? 'line-through text-text-muted' : 'text-text-main'}`}>
                                                {med.name}
                                            </h5>
                                            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 bg-surface rounded border border-surface-border text-text-muted">
                                                {med.dosage}
                                            </span>
                                            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 bg-accent/10 border border-accent/20 text-accent rounded capitalize">
                                                {med.category}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-3 text-xs text-text-muted mt-1">
                                            <span className="flex items-center gap-1 font-display font-semibold text-accent">
                                                <Clock className="w-3.5 h-3.5" /> {med.scheduledTime}
                                            </span>
                                            {med.instructions && <span>• {med.instructions}</span>}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-surface-border">
                                    <span className={`text-xs font-display font-bold px-2.5 py-1 rounded-lg ${isTakenToday ? 'bg-success/15 text-success' : 'bg-warning-bg text-warning'
                                        }`}>
                                        {isTakenToday ? 'Taken Today' : 'Pending Dose'}
                                    </span>

                                    <button
                                        onClick={() => handleDelete(med._id)}
                                        className="p-2 text-text-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                                        title="Delete Medication"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
