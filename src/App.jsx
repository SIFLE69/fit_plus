import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import OnboardingForm from './components/OnboardingForm';
import Dashboard from './pages/Dashboard';
import DietPage from './pages/DietPage';
import WorkoutPlanPage from './pages/WorkoutPlanPage';
import ProgressPage from './pages/ProgressPage';
import ProfilePage from './pages/ProfilePage';
import PricingPage from './components/PricingPage';
import MedicationTracker from './components/MedicationTracker';
import SettingsModal from './components/SettingsModal';
import {
    getStoredProfileId,
    setStoredProfileId,
    logoutProfile,
    createProfile,
    registerProfile,
    loginProfile,
    googleAuthProfile,
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
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

    const loadDataForProfile = async (profileId) => {
        try {
            setLoading(true);
            const pData = await getProfile(profileId);
            const loadedProfile = pData?.profile || pData;

            if (loadedProfile && loadedProfile._id) {
                setProfile(loadedProfile);
                const [dData, wData, lData, bData] = await Promise.all([
                    getDietPlan(profileId).catch(() => null),
                    getWorkoutPlan(profileId).catch(() => null),
                    getLogs(profileId).catch(() => []),
                    getBadges(profileId).catch(() => []),
                ]);
                setDietPlan(dData);
                setWorkoutPlan(wData);
                setLogs(lData || []);
                setBadges(bData || []);
            } else {
                setStoredProfileId(null);
                setProfile(null);
            }
        } catch (err) {
            console.error('Failed to load profile data:', err);
            setStoredProfileId(null);
            setProfile(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const storedId = getStoredProfileId();
        if (storedId) {
            loadDataForProfile(storedId);
        } else {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('fitcode_theme', 'light');
    }, []);

    const refreshData = async () => {
        if (profile?._id) {
            await loadDataForProfile(profile._id);
        }
    };

    const handleCreateProfile = async (formData) => {
        setOnboardingLoading(true);
        try {
            const res = await registerProfile(formData);
            const newProfile = res?.profile || res;
            if (newProfile && newProfile._id) {
                setStoredProfileId(newProfile._id);
                await loadDataForProfile(newProfile._id);
            }
        } catch (err) {
            console.error('Registration failed:', err);
            throw err;
        } finally {
            setOnboardingLoading(false);
        }
    };

    const handleLoginProfile = async (loginData) => {
        setOnboardingLoading(true);
        try {
            const res = await loginProfile(loginData);
            const loggedProfile = res?.profile || res;
            if (loggedProfile && loggedProfile._id) {
                setStoredProfileId(loggedProfile._id);
                await loadDataForProfile(loggedProfile._id);
            }
        } catch (err) {
            console.error('Login failed:', err);
            throw err;
        } finally {
            setOnboardingLoading(false);
        }
    };

    const handleGoogleAuth = async (googlePayload) => {
        setOnboardingLoading(true);
        try {
            const res = await googleAuthProfile(googlePayload);
            const loggedProfile = res?.profile || res;
            if (loggedProfile && loggedProfile._id) {
                setStoredProfileId(loggedProfile._id);
                await loadDataForProfile(loggedProfile._id);
            }
        } catch (err) {
            console.error('Google Auth failed:', err);
            throw err;
        } finally {
            setOnboardingLoading(false);
        }
    };

    const handleResetSession = () => {
        if (window.confirm('Sign out of your account and return to login screen?')) {
            logoutProfile();
            setProfile(null);
            setDietPlan(null);
            setWorkoutPlan(null);
            setLogs([]);
            setBadges([]);
        }
    };

    const handleTogglePremium = async () => {
        if (!profile?._id) return;
        const newStatus = !profile.isPremium;
        await updateProfile(profile._id, { isPremium: newStatus });
        refreshData();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-bg flex flex-col items-center justify-center">
                <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-xs text-text-muted">Loading your data...</p>
            </div>
        );
    }

    if (!profile) {
        return (
            <OnboardingForm
                onSubmitProfile={handleCreateProfile}
                onLoginProfile={handleLoginProfile}
                onGoogleAuth={handleGoogleAuth}
                loading={onboardingLoading}
            />
        );
    }

    return (
        <div className="min-h-screen bg-bg text-text-main flex flex-col">
            <Navbar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                profile={profile}
                onResetSession={handleResetSession}
                onOpenSettings={() => setIsSettingsModalOpen(true)}
            />

            <main className="flex-1 mb-16 md:mb-0">
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

                {activeTab === 'diet' && (
                    <div className="max-w-5xl mx-auto px-5 py-8">
                        <DietPage
                            profile={profile}
                            dietPlan={dietPlan}
                            onRefreshData={refreshData}
                        />
                    </div>
                )}

                {activeTab === 'workout' && (
                    <div className="max-w-5xl mx-auto px-5 py-8">
                        <WorkoutPlanPage
                            workoutPlan={workoutPlan}
                            profile={profile}
                            onRefreshData={refreshData}
                            logs={logs}
                        />
                    </div>
                )}

                {activeTab === 'meds' && (
                    <div className="max-w-5xl mx-auto px-5 py-8">
                        <MedicationTracker
                            profile={profile}
                        />
                    </div>
                )}

                {activeTab === 'progress' && (
                    <div className="max-w-5xl mx-auto px-5 py-8">
                        <ProgressPage
                            profile={profile}
                            logs={logs}
                            badges={badges}
                            onRefreshData={refreshData}
                            onNavigate={setActiveTab}
                        />
                    </div>
                )}

                {activeTab === 'profile' && (
                    <div className="max-w-5xl mx-auto px-5 py-8">
                        <ProfilePage
                            profile={profile}
                            logs={logs}
                            badges={badges}
                            onRefreshData={refreshData}
                            onOpenSettings={() => setIsSettingsModalOpen(true)}
                        />
                    </div>
                )}

                {activeTab === 'pricing' && (
                    <div className="max-w-5xl mx-auto px-5 py-8">
                        <PricingPage
                            profile={profile}
                            onTogglePremium={handleTogglePremium}
                        />
                    </div>
                )}
            </main>

            <BottomNav
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isPremium={profile.isPremium}
            />

            <SettingsModal
                profile={profile}
                isOpen={isSettingsModalOpen}
                onClose={() => setIsSettingsModalOpen(false)}
                onRefreshData={refreshData}
            />
        </div>
    );
}
