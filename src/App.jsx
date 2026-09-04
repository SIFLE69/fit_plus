import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import OnboardingForm from './components/OnboardingForm';
import Dashboard from './pages/Dashboard';
import WorkoutPlanPage from './pages/WorkoutPlanPage';
import ProgressPage from './pages/ProgressPage';
import PricingPage from './components/PricingPage';
import {
    getStoredProfileId,
    setStoredProfileId,
    createProfile,
    getProfile,
    updateProfile,
    getDietPlan,
    getWorkoutPlan,
    getLogs,
    getBadges,
} from './services/api';

export default function App() {
    const [profile, setProfile] = useState(null);
    const [dietPlan, setDietPlan] = useState(null);
    const [workoutPlan, setWorkoutPlan] = useState(null);
    const [logs, setLogs] = useState([]);
    const [badges, setBadges] = useState([]);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [loading, setLoading] = useState(true);
    const [onboardingLoading, setOnboardingLoading] = useState(false);

    // Initial Load: Check if profile ID exists in localStorage
    const loadUserData = async (profileId) => {
        try {
            setLoading(true);
            const prof = await getProfile(profileId);
            setProfile(prof);

            const [diet, workout, userLogs, userBadges] = await Promise.all([
                getDietPlan(profileId).catch(() => null),
                getWorkoutPlan(profileId).catch(() => null),
                getLogs(profileId).catch(() => []),
                getBadges(profileId).catch(() => []),
            ]);

            setDietPlan(diet);
            setWorkoutPlan(workout);
            setLogs(userLogs);
            setBadges(userBadges);
        } catch (err) {
            console.warn('Failed to load profile from stored ID. Clearing session.', err);
            setStoredProfileId(null);
            setProfile(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const storedId = getStoredProfileId();
        if (storedId) {
            loadUserData(storedId);
        } else {
            setLoading(false);
        }
    }, []);

    const handleCreateProfile = async (formData) => {
        try {
            setOnboardingLoading(true);
            const res = await createProfile(formData);
            setProfile(res.profile);
            setDietPlan(res.dietPlan);
            setWorkoutPlan(res.workoutPlan);
            await refreshData(res.profile._id);
            setActiveTab('dashboard');
        } catch (err) {
            console.error('Error creating profile:', err);
        } finally {
            setOnboardingLoading(false);
        }
    };

    const refreshData = async (overrideId) => {
        const targetId = overrideId || profile?._id;
        if (!targetId) return;

        try {
            const [prof, diet, workout, userLogs, userBadges] = await Promise.all([
                getProfile(targetId),
                getDietPlan(targetId).catch(() => null),
                getWorkoutPlan(targetId).catch(() => null),
                getLogs(targetId).catch(() => []),
                getBadges(targetId).catch(() => []),
            ]);

            setProfile(prof);
            setDietPlan(diet);
            setWorkoutPlan(workout);
            setLogs(userLogs);
            setBadges(userBadges);
        } catch (err) {
            console.error('Error refreshing data:', err);
        }
    };

    const handleTogglePremium = async (newStatus) => {
        if (!profile?._id) return;
        const updated = await updateProfile(profile._id, { isPremium: newStatus });
        setProfile(updated);
    };

    const handleResetSession = () => {
        if (window.confirm('Reset local session and start new onboarding?')) {
            setStoredProfileId(null);
            setProfile(null);
            setDietPlan(null);
            setWorkoutPlan(null);
            setLogs([]);
            setBadges([]);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-bg flex items-center justify-center text-text-muted">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
                    <span className="font-display font-semibold text-sm tracking-wider uppercase">Loading FitPlan OS...</span>
                </div>
            </div>
        );
    }

    // Show Onboarding if no profile is set
    if (!profile) {
        return (
            <div className="min-h-screen bg-bg text-text-main">
                <OnboardingForm onSubmitProfile={handleCreateProfile} loading={onboardingLoading} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg text-text-main flex flex-col selection:bg-accent selection:text-bg">
            <Navbar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                profile={profile}
                onResetSession={handleResetSession}
            />

            <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 mb-16 md:mb-0">
                {activeTab === 'dashboard' && (
                    <Dashboard
                        profile={profile}
                        dietPlan={dietPlan}
                        workoutPlan={workoutPlan}
                        logs={logs}
                        onNavigate={setActiveTab}
                        onRefreshData={refreshData}
                    />
                )}

                {activeTab === 'workout' && (
                    <WorkoutPlanPage
                        workoutPlan={workoutPlan}
                        profile={profile}
                        onRefreshData={refreshData}
                        logs={logs}
                    />
                )}

                {activeTab === 'progress' && (
                    <ProgressPage
                        profile={profile}
                        logs={logs}
                        badges={badges}
                        onRefreshData={refreshData}
                    />
                )}

                {activeTab === 'pricing' && (
                    <PricingPage
                        profile={profile}
                        onTogglePremium={handleTogglePremium}
                    />
                )}
            </main>

            <BottomNav
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isPremium={profile.isPremium}
            />
        </div>
    );
}
