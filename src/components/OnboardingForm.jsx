import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ArrowLeft, Check, AlertCircle, Shield, HeartPulse, Apple, Mail, Lock, LogIn, Database, Terminal, Settings, Key } from 'lucide-react';

const GoogleIcon = () => (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
        <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        />
        <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        />
    </svg>
);

export default function OnboardingForm({ onSubmitProfile, onLoginProfile, onGoogleAuth, loading }) {
    const [isLoginMode, setIsLoginMode] = useState(false);
    const [step, setStep] = useState(1);

    // Dynamic Google Client ID state
    const envClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || localStorage.getItem('fitcode_google_client_id') || '';
    const [googleClientId, setGoogleClientId] = useState(envClientId);
    const [showClientIdInput, setShowClientIdInput] = useState(!envClientId);
    const [isGsiLoaded, setIsGsiLoaded] = useState(false);

    const googleBtnRefLogin = useRef(null);
    const googleBtnRefSignup = useRef(null);

    // Auto-load saved credentials from localStorage
    const savedEmail = localStorage.getItem('fitcode_cred_email') || '';
    const savedPassword = localStorage.getItem('fitcode_cred_password') || '';

    const [loginData, setLoginData] = useState({
        email: savedEmail,
        password: savedPassword
    });
    const [loginError, setLoginError] = useState('');
    const [regError, setRegError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: savedEmail,
        password: savedPassword,
        age: 26,
        gender: 'male',
        weightKg: 75,
        heightCm: 175,
        goal: 'cut',
        activityLevel: 'moderate',
        trainingStyle: 'strength',
        conditionsInput: '',
        diseases: [],
        allergies: [],
    });

    // Dynamically load Official Google Identity Services Script
    useEffect(() => {
        const loadGsi = () => {
            if (typeof window !== 'undefined' && !window.google) {
                const script = document.createElement('script');
                script.src = 'https://accounts.google.com/gsi/client';
                script.async = true;
                script.defer = true;
                script.onload = () => {
                    setIsGsiLoaded(true);
                };
                document.body.appendChild(script);
            } else if (window.google) {
                setIsGsiLoaded(true);
            }
        };
        loadGsi();
    }, []);

    // Initialize Google Identity Services when Client ID is available
    useEffect(() => {
        if (!isGsiLoaded || !googleClientId || !window.google?.accounts?.id) return;

        try {
            window.google.accounts.id.initialize({
                client_id: googleClientId,
                callback: (response) => {
                    if (response.credential && onGoogleAuth) {
                        onGoogleAuth({ credential: response.credential, clientId: googleClientId });
                    }
                },
                auto_select: false,
            });

            // Render Google Official Button on Login container
            if (googleBtnRefLogin.current) {
                googleBtnRefLogin.current.innerHTML = '';
                window.google.accounts.id.renderButton(googleBtnRefLogin.current, {
                    theme: 'outline',
                    size: 'large',
                    width: '100%',
                    text: 'continue_with',
                    shape: 'rectangular',
                });
            }

            // Render Google Official Button on Signup container
            if (googleBtnRefSignup.current) {
                googleBtnRefSignup.current.innerHTML = '';
                window.google.accounts.id.renderButton(googleBtnRefSignup.current, {
                    theme: 'outline',
                    size: 'large',
                    width: '100%',
                    text: 'signup_with',
                    shape: 'rectangular',
                });
            }
        } catch (err) {
            console.error('Google GSI Initialization Error:', err);
        }
    }, [isGsiLoaded, googleClientId, isLoginMode, step, onGoogleAuth]);

    const handleSaveClientId = (e) => {
        e.preventDefault();
        const trimmed = googleClientId.trim();
        if (trimmed) {
            localStorage.setItem('fitcode_google_client_id', trimmed);
            setGoogleClientId(trimmed);
            setShowClientIdInput(false);
        }
    };

    const handlePromptGoogleAuth = () => {
        setLoginError('');
        setRegError('');
        if (!googleClientId) {
            setShowClientIdInput(true);
            return;
        }

        if (window.google?.accounts?.id) {
            window.google.accounts.id.prompt();
        } else {
            const err = 'Google Identity Services SDK is loading... Please wait a second and try again.';
            setLoginError(err);
            setRegError(err);
        }
    };

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const toggleArrayItem = (field, item) => {
        setFormData((prev) => {
            const arr = prev[field] || [];
            if (arr.includes(item)) {
                return { ...prev, [field]: arr.filter((i) => i !== item) };
            } else {
                return { ...prev, [field]: [...arr, item] };
            }
        });
    };

    const handleNext = () => {
        if (step === 1 && !formData.name.trim()) return;
        if (step < 4) setStep(step + 1);
    };

    const handlePrev = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setRegError('');
        const conditions = formData.conditionsInput
            ? formData.conditionsInput.split(',').map((c) => c.trim()).filter(Boolean)
            : [];

        const emailClean = formData.email ? formData.email.trim().toLowerCase() : undefined;
        if (emailClean && formData.password) {
            localStorage.setItem('fitcode_cred_email', emailClean);
            localStorage.setItem('fitcode_cred_password', formData.password);
        }

        try {
            await onSubmitProfile({
                name: formData.name.trim() || 'Athlete',
                email: emailClean,
                password: formData.password || undefined,
                age: Number(formData.age),
                gender: formData.gender,
                weightKg: Number(formData.weightKg),
                heightCm: Number(formData.heightCm),
                goal: formData.goal,
                activityLevel: formData.activityLevel,
                trainingStyle: formData.trainingStyle,
                conditions,
                diseases: formData.diseases,
                allergies: formData.allergies,
            });
        } catch (err) {
            const errMsg = err.response?.data?.error || err.message || 'Registration failed.';
            setRegError(errMsg);
            if (errMsg.toLowerCase().includes('already exists')) {
                setLoginData((prev) => ({ ...prev, email: formData.email, password: formData.password }));
            }
        }
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoginError('');
        if (!loginData.email || !loginData.password) {
            setLoginError('Please enter both email and password.');
            return;
        }
        try {
            localStorage.setItem('fitcode_cred_email', loginData.email.trim().toLowerCase());
            localStorage.setItem('fitcode_cred_password', loginData.password);
            await onLoginProfile(loginData);
        } catch (err) {
            setLoginError(err.response?.data?.error || err.message || 'Invalid credentials or connection error.');
        }
    };

    const isSenior = Number(formData.age) >= 50;

    return (
        <div className="min-h-[85vh] flex items-center justify-center p-4">
            {isLoginMode ? (
                <div className="w-full max-w-md bg-surface border border-surface-border rounded-xl p-6 sm:p-8 shadow-card relative overflow-hidden">
                    <div className="mb-6 text-center">
                        <div className="w-10 h-10 bg-accent/15 border border-accent/30 rounded-lg flex items-center justify-center mx-auto mb-3 text-accent font-mono font-bold">
                            <Terminal className="w-5 h-5 text-accent" />
                        </div>
                        <h2 className="text-xl font-bold text-text-main">Sign In to FitCode</h2>
                        <p className="text-xs text-text-muted mt-1">Access your account profile & personalized fitness data</p>
                    </div>

                    {loginError && (
                        <div className="mb-4 p-3 bg-danger/15 border border-danger/30 rounded-lg text-danger text-xs flex items-center gap-2 font-semibold">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{loginError}</span>
                        </div>
                    )}

                    {/* Google OAuth Configuration & Render Container */}
                    <div className="mb-4">
                        {googleClientId ? (
                            <div>
                                <div ref={googleBtnRefLogin} className="w-full min-h-[40px] flex justify-center mb-2">
                                    <button
                                        type="button"
                                        onClick={handlePromptGoogleAuth}
                                        className="w-full py-2.5 px-4 rounded-lg bg-surface border border-surface-hover text-text-main hover:bg-surface-hover font-semibold text-xs flex items-center justify-center gap-2.5 transition-colors shadow-sm cursor-pointer"
                                    >
                                        <GoogleIcon />
                                        <span>Continue with Google</span>
                                    </button>
                                </div>
                                <div className="flex items-center justify-between text-[10px] text-text-muted px-1">
                                    <span className="flex items-center gap-1 font-mono text-success">
                                        <Shield className="w-3 h-3" /> Cryptographic Token Verified
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setShowClientIdInput(true)}
                                        className="hover:underline flex items-center gap-1 text-text-muted"
                                    >
                                        <Settings className="w-3 h-3" /> Config ID
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setShowClientIdInput(true)}
                                className="w-full py-2.5 px-4 rounded-lg bg-surface border border-surface-hover text-text-main hover:bg-surface-hover font-semibold text-xs flex items-center justify-center gap-2.5 transition-colors shadow-sm cursor-pointer"
                            >
                                <GoogleIcon />
                                <span>Setup Official Google OAuth Client</span>
                            </button>
                        )}

                        {showClientIdInput && (
                            <form onSubmit={handleSaveClientId} className="mt-3 p-3 bg-bg border border-surface-border rounded-lg space-y-2 text-xs">
                                <div className="flex items-center justify-between">
                                    <label className="font-semibold text-text-main flex items-center gap-1.5">
                                        <Key className="w-3.5 h-3.5 text-accent" /> Google Cloud Client ID
                                    </label>
                                    {googleClientId && (
                                        <button
                                            type="button"
                                            onClick={() => setShowClientIdInput(false)}
                                            className="text-[10px] text-text-muted hover:underline"
                                        >
                                            Hide
                                        </button>
                                    )}
                                </div>
                                <input
                                    type="text"
                                    required
                                    placeholder="123456789-abc.apps.googleusercontent.com"
                                    value={googleClientId}
                                    onChange={(e) => setGoogleClientId(e.target.value)}
                                    className="w-full bg-surface border border-surface-hover rounded px-2.5 py-1.5 text-text-main font-mono text-[11px] focus:outline-none focus:border-accent"
                                />
                                <p className="text-[10px] text-text-muted">
                                    Create in <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noreferrer" className="text-accent hover:underline">Google Cloud Console</a> under Credentials &gt; OAuth 2.0 Client IDs.
                                </p>
                                <button
                                    type="submit"
                                    className="w-full py-1.5 rounded bg-accent text-bg hover:bg-accent-hover font-bold text-xs transition-colors"
                                >
                                    Save & Enable Live Google OAuth
                                </button>
                            </form>
                        )}
                    </div>

                    <div className="flex items-center gap-3 my-4">
                        <div className="h-px bg-surface-hover flex-1" />
                        <span className="text-[11px] font-semibold text-text-muted uppercase">Or Sign In With Email</span>
                        <div className="h-px bg-surface-hover flex-1" />
                    </div>

                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-text-muted uppercase mb-1">Email Address</label>
                            <div className="relative">
                                <Mail className="w-4 h-4 text-text-muted absolute left-3 top-3" />
                                <input
                                    type="email"
                                    required
                                    placeholder="alex@fitplan.com"
                                    value={loginData.email}
                                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                    className="w-full bg-bg border border-surface-hover rounded-lg pl-9 pr-4 py-2 text-text-main text-xs focus:outline-none focus:border-accent"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-text-muted uppercase mb-1">Password</label>
                            <div className="relative">
                                <Lock className="w-4 h-4 text-text-muted absolute left-3 top-3" />
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    value={loginData.password}
                                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                    className="w-full bg-bg border border-surface-hover rounded-lg pl-9 pr-4 py-2 text-text-main text-xs focus:outline-none focus:border-accent"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 rounded-lg bg-accent text-bg hover:bg-accent-hover font-bold text-xs flex items-center justify-center gap-2 transition-colors mt-2"
                        >
                            {loading ? 'Authenticating...' : 'Sign In to Account'}
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setLoginData({ email: 'alex@fitplan.com', password: 'password123' });
                            }}
                            className="w-full py-2 rounded-lg bg-surface-hover text-text-main hover:bg-surface-elevated font-semibold text-xs transition-colors"
                        >
                            Fill Demo Credentials (alex@fitplan.com)
                        </button>
                    </form>

                    <div className="mt-6 pt-4 border-t border-surface-hover text-center">
                        <p className="text-xs text-text-muted">
                            Need a new profile?{' '}
                            <button
                                type="button"
                                onClick={() => setIsLoginMode(false)}
                                className="text-accent font-semibold hover:underline"
                            >
                                Create New Profile
                            </button>
                        </p>
                    </div>
                </div>
            ) : (
                <div className="w-full max-w-xl bg-surface border border-surface-border rounded-xl p-6 sm:p-8 shadow-card relative overflow-hidden">
                    {/* Mode Switch Header */}
                    <div className="flex items-center justify-between pb-4 mb-6 border-b border-surface-border">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center text-accent font-mono font-bold text-sm">
                                <Terminal className="w-4 h-4 text-accent" />
                            </div>
                            <div>
                                <h1 className="text-base font-bold text-text-main">Athlete Setup</h1>
                                <p className="text-xs text-text-muted">Create profile & initialize AI engines</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsLoginMode(true)}
                            className="px-3 py-1.5 rounded-lg bg-accent/10 hover:bg-accent/20 text-accent font-semibold text-xs flex items-center gap-1.5 transition-colors"
                        >
                            <LogIn className="w-3.5 h-3.5" />
                            Sign In Existing
                        </button>
                    </div>

                    {regError && (
                        <div className="mb-4 p-3 bg-danger/15 border border-danger/30 rounded-lg text-danger text-xs flex items-center gap-2 font-semibold">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{regError}</span>
                        </div>
                    )}

                    {/* Google OAuth Render Container on Step 1 */}
                    {step === 1 && (
                        <div className="mb-6">
                            {googleClientId ? (
                                <div>
                                    <div ref={googleBtnRefSignup} className="w-full min-h-[40px] flex justify-center mb-2">
                                        <button
                                            type="button"
                                            onClick={handlePromptGoogleAuth}
                                            className="w-full py-2.5 px-4 rounded-lg bg-surface border border-surface-hover text-text-main hover:bg-surface-hover font-semibold text-xs flex items-center justify-center gap-2.5 transition-colors shadow-sm cursor-pointer"
                                        >
                                            <GoogleIcon />
                                            <span>Sign up instantly with Google</span>
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between text-[10px] text-text-muted px-1">
                                        <span className="flex items-center gap-1 font-mono text-emerald-500">
                                            <Shield className="w-3 h-3" /> Cryptographic Token Verification Active
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setShowClientIdInput(true)}
                                            className="hover:underline flex items-center gap-1 text-text-muted"
                                        >
                                            <Settings className="w-3 h-3" /> Config ID
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setShowClientIdInput(true)}
                                    className="w-full py-2.5 px-4 rounded-lg bg-surface border border-surface-hover text-text-main hover:bg-surface-hover font-semibold text-xs flex items-center justify-center gap-2.5 transition-colors shadow-sm cursor-pointer"
                                >
                                    <GoogleIcon />
                                    <span>Setup Official Google OAuth Client</span>
                                </button>
                            )}

                            {showClientIdInput && (
                                <form onSubmit={handleSaveClientId} className="mt-3 p-3 bg-bg border border-surface-border rounded-lg space-y-2 text-xs">
                                    <div className="flex items-center justify-between">
                                        <label className="font-semibold text-text-main flex items-center gap-1.5">
                                            <Key className="w-3.5 h-3.5 text-accent" /> Google Cloud Client ID
                                        </label>
                                        {googleClientId && (
                                            <button
                                                type="button"
                                                onClick={() => setShowClientIdInput(false)}
                                                className="text-[10px] text-text-muted hover:underline"
                                            >
                                                Hide
                                            </button>
                                        )}
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        placeholder="123456789-abc.apps.googleusercontent.com"
                                        value={googleClientId}
                                        onChange={(e) => setGoogleClientId(e.target.value)}
                                        className="w-full bg-surface border border-surface-hover rounded px-2.5 py-1.5 text-text-main font-mono text-[11px] focus:outline-none focus:border-accent"
                                    />
                                    <p className="text-[10px] text-text-muted">
                                        Create in <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noreferrer" className="text-accent hover:underline">Google Cloud Console</a> under Credentials &gt; OAuth 2.0 Client IDs.
                                    </p>
                                    <button
                                        type="submit"
                                        className="w-full py-1.5 rounded bg-accent text-bg hover:bg-accent-hover font-bold text-xs transition-colors"
                                    >
                                        Save & Enable Live Google OAuth
                                    </button>
                                </form>
                            )}

                            <div className="flex items-center gap-3 my-4">
                                <div className="h-px bg-surface-hover flex-1" />
                                <span className="text-[11px] font-semibold text-text-muted uppercase">Or Customize Profile Manually</span>
                                <div className="h-px bg-surface-hover flex-1" />
                            </div>
                        </div>
                    )}

                    {/* Progress Indicators */}
                    <div className="flex items-center justify-between mb-8 relative">
                        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-surface-border -z-0 -translate-y-1/2" />
                        {[1, 2, 3, 4].map((s) => (
                            <div
                                key={s}
                                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-all z-10 ${step >= s
                                    ? 'bg-accent text-bg shadow-sm scale-110'
                                    : 'bg-surface border border-surface-border text-text-muted'
                                    }`}
                            >
                                {step > s ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : s}
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* STEP 1: Basic Bio & Credentials */}
                        {step === 1 && (
                            <div className="space-y-4 animate-in fade-in duration-200">
                                <div>
                                    <label className="block text-xs font-semibold text-text-muted uppercase mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Alex Vance"
                                        value={formData.name}
                                        onChange={(e) => handleChange('name', e.target.value)}
                                        className="w-full bg-bg border border-surface-border rounded-lg px-3 py-2 text-text-main text-xs focus:outline-none focus:border-accent"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-text-muted uppercase mb-1">Email (Optional)</label>
                                        <input
                                            type="email"
                                            placeholder="alex@fitplan.com"
                                            value={formData.email}
                                            onChange={(e) => handleChange('email', e.target.value)}
                                            className="w-full bg-bg border border-surface-border rounded-lg px-3 py-2 text-text-main text-xs focus:outline-none focus:border-accent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-text-muted uppercase mb-1">Password (Optional)</label>
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={(e) => handleChange('password', e.target.value)}
                                            className="w-full bg-bg border border-surface-border rounded-lg px-3 py-2 text-text-main text-xs focus:outline-none focus:border-accent"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-text-muted uppercase mb-1">Age (Years)</label>
                                        <input
                                            type="number"
                                            min="12"
                                            max="100"
                                            value={formData.age}
                                            onChange={(e) => handleChange('age', e.target.value)}
                                            className="w-full bg-bg border border-surface-border rounded-lg px-3 py-2 text-text-main text-xs focus:outline-none focus:border-accent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-text-muted uppercase mb-1">Gender</label>
                                        <select
                                            value={formData.gender}
                                            onChange={(e) => handleChange('gender', e.target.value)}
                                            className="w-full bg-bg border border-surface-border rounded-lg px-3 py-2 text-text-main text-xs focus:outline-none focus:border-accent"
                                        >
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                {isSenior && (
                                    <div className="p-3 bg-accent/10 border border-accent/30 rounded-lg text-accent text-xs flex items-center gap-2">
                                        <HeartPulse className="w-4 h-4 shrink-0 text-accent" />
                                        <span>Senior athlete detected (&gt;= 50 yrs). Low-impact joint preservation algorithms enabled.</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* STEP 2: Metrics & Goal */}
                        {step === 2 && (
                            <div className="space-y-4 animate-in fade-in duration-200">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-text-muted uppercase mb-1">Weight (kg)</label>
                                        <input
                                            type="number"
                                            step="0.5"
                                            min="30"
                                            max="250"
                                            value={formData.weightKg}
                                            onChange={(e) => handleChange('weightKg', e.target.value)}
                                            className="w-full bg-bg border border-surface-border rounded-lg px-3 py-2 text-text-main text-xs focus:outline-none focus:border-accent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-text-muted uppercase mb-1">Height (cm)</label>
                                        <input
                                            type="number"
                                            min="100"
                                            max="230"
                                            value={formData.heightCm}
                                            onChange={(e) => handleChange('heightCm', e.target.value)}
                                            className="w-full bg-bg border border-surface-border rounded-lg px-3 py-2 text-text-main text-xs focus:outline-none focus:border-accent"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-text-muted uppercase mb-2">Primary Goal</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { id: 'cut', label: 'Fat Loss (Cut)', desc: '-500 kcal deficit' },
                                            { id: 'maintain', label: 'Maintain Composition', desc: 'Equilibrium TDEE' },
                                            { id: 'bulk', label: 'Hypertrophy (Bulk)', desc: '+300 kcal surplus' }
                                        ].map((g) => (
                                            <button
                                                key={g.id}
                                                type="button"
                                                onClick={() => handleChange('goal', g.id)}
                                                className={`p-3 rounded-lg border text-left transition-all ${formData.goal === g.id
                                                    ? 'bg-accent/15 border-accent text-text-main font-bold'
                                                    : 'bg-bg border-surface-border text-text-muted hover:border-text-muted'
                                                    }`}
                                            >
                                                <p className="text-xs">{g.label}</p>
                                                <p className="text-[10px] text-text-muted mt-0.5">{g.desc}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-text-muted uppercase mb-2">Activity Level</label>
                                    <select
                                        value={formData.activityLevel}
                                        onChange={(e) => handleChange('activityLevel', e.target.value)}
                                        className="w-full bg-bg border border-surface-border rounded-lg px-3 py-2 text-text-main text-xs focus:outline-none focus:border-accent"
                                    >
                                        <option value="sedentary">Sedentary (Desk job, minimal movement)</option>
                                        <option value="light">Lightly Active (1-3 days exercise/week)</option>
                                        <option value="moderate">Moderately Active (3-5 days exercise/week)</option>
                                        <option value="active">Very Active (6-7 heavy workouts/week)</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* STEP 3: Training Style & Physical Conditions */}
                        {step === 3 && (
                            <div className="space-y-4 animate-in fade-in duration-200">
                                <div>
                                    <label className="block text-xs font-semibold text-text-muted uppercase mb-2">Training Style Preference</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {[
                                            { id: 'strength', label: 'Strength / Powerlifting' },
                                            { id: 'gym', label: 'Bodybuilding / Hypertrophy' },
                                            { id: 'calisthenics', label: 'Bodyweight / Calisthenics' },
                                            { id: 'mix', label: 'Hybrid Athletic Functional' }
                                        ].map((t) => (
                                            <button
                                                key={t.id}
                                                type="button"
                                                onClick={() => handleChange('trainingStyle', t.id)}
                                                className={`p-2.5 rounded-lg border text-left text-xs transition-all ${formData.trainingStyle === t.id
                                                    ? 'bg-accent/15 border-accent text-text-main font-bold'
                                                    : 'bg-bg border-surface-border text-text-muted hover:border-text-muted'
                                                    }`}
                                            >
                                                {t.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-text-muted uppercase mb-1">
                                        Joint Limitations / Injured Areas (Comma Separated)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. knee, shoulder, lower back"
                                        value={formData.conditionsInput}
                                        onChange={(e) => handleChange('conditionsInput', e.target.value)}
                                        className="w-full bg-bg border border-surface-border rounded-lg px-3 py-2 text-text-main text-xs focus:outline-none focus:border-accent"
                                    />
                                    <p className="text-[10px] text-text-muted mt-1">Exercises straining these areas will automatically be filtered out.</p>
                                </div>
                            </div>
                        )}

                        {/* STEP 4: Medical Conditions & Dietary Restrictions */}
                        {step === 4 && (
                            <div className="space-y-5 animate-in fade-in duration-200">
                                <div>
                                    <label className="block text-xs font-semibold text-text-muted uppercase mb-2 flex items-center gap-1.5">
                                        <Shield className="w-3.5 h-3.5 text-accent" />
                                        Medical Conditions (Enforces Clinical Diet Rules)
                                    </label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {[
                                            { id: 'diabetes', label: 'Diabetes (Type 1/2)' },
                                            { id: 'hypertension', label: 'Hypertension' },
                                            { id: 'ckd', label: 'Kidney Disease (CKD)' },
                                            { id: 'gout', label: 'Gout (High Uric Acid)' },
                                            { id: 'ibs', label: 'IBS / Digestive Sensitivity' }
                                        ].map((d) => {
                                            const isSelected = formData.diseases.includes(d.id);
                                            return (
                                                <button
                                                    key={d.id}
                                                    type="button"
                                                    onClick={() => toggleArrayItem('diseases', d.id)}
                                                    className={`p-2 rounded-lg border text-left text-xs transition-all ${isSelected
                                                        ? 'bg-accent/15 border-accent text-text-main font-bold'
                                                        : 'bg-bg border-surface-border text-text-muted hover:border-text-muted'
                                                        }`}
                                                >
                                                    {d.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-text-muted uppercase mb-2 flex items-center gap-1.5">
                                        <Apple className="w-3.5 h-3.5 text-accent" />
                                        Allergies & Excluded Foods
                                    </label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {[
                                            { id: 'nuts', label: 'Nuts & Peanuts' },
                                            { id: 'dairy', label: 'Lactose / Dairy' },
                                            { id: 'gluten', label: 'Gluten / Wheat' },
                                            { id: 'shellfish', label: 'Seafood & Shellfish' },
                                            { id: 'eggs', label: 'Eggs' },
                                            { id: 'soy', label: 'Soy Products' }
                                        ].map((a) => {
                                            const isSelected = formData.allergies.includes(a.id);
                                            return (
                                                <button
                                                    key={a.id}
                                                    type="button"
                                                    onClick={() => toggleArrayItem('allergies', a.id)}
                                                    className={`p-2 rounded-lg border text-left text-xs transition-all ${isSelected
                                                        ? 'bg-accent/15 border-accent text-text-main font-bold'
                                                        : 'bg-bg border-surface-border text-text-muted hover:border-text-muted'
                                                        }`}
                                                >
                                                    {a.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step Navigation Controls */}
                        <div className="flex items-center justify-between pt-4 border-t border-surface-border">
                            {step > 1 ? (
                                <button
                                    type="button"
                                    onClick={handlePrev}
                                    className="px-4 py-2 rounded-lg bg-surface border border-surface-border text-text-main hover:bg-surface-hover text-xs font-semibold flex items-center gap-1.5 transition-colors"
                                >
                                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                                </button>
                            ) : <div />}

                            {step < 4 ? (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    disabled={step === 1 && !formData.name.trim()}
                                    className="px-5 py-2 rounded-lg bg-accent text-bg hover:bg-accent-hover text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                                >
                                    Next Step <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2.5 rounded-lg bg-accent text-bg hover:bg-accent-hover text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
                                >
                                    {loading ? 'Compiling Profile...' : 'Complete Profile Setup'}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
