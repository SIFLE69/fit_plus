import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to attach Authorization Bearer token to all requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('fitcode_auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

// Single-session profile ID & Auth manager
export const getStoredProfileId = () => {
    return localStorage.getItem('fitplan_profile_id');
};

export const setStoredProfileId = (id) => {
    if (id) {
        localStorage.setItem('fitplan_profile_id', id);
    } else {
        localStorage.removeItem('fitplan_profile_id');
    }
};

export const logoutProfile = () => {
    localStorage.removeItem('fitplan_profile_id');
    localStorage.removeItem('fitcode_auth_token');
};

// API Services
export const registerProfile = async (profileData) => {
    const res = await api.post('/profiles/register', profileData);
    if (res.data?.token) {
        localStorage.setItem('fitcode_auth_token', res.data.token);
    }
    if (res.data?.profile?._id) {
        setStoredProfileId(res.data.profile._id);
    }
    return res.data;
};

export const loginProfile = async (credentials) => {
    const res = await api.post('/profiles/login', credentials);
    if (res.data?.token) {
        localStorage.setItem('fitcode_auth_token', res.data.token);
    }
    if (res.data?.profile?._id) {
        setStoredProfileId(res.data.profile._id);
    }
    return res.data;
};

export const googleAuthProfile = async (googlePayload) => {
    const res = await api.post('/profiles/google-auth', googlePayload);
    if (res.data?.token) {
        localStorage.setItem('fitcode_auth_token', res.data.token);
    }
    if (res.data?.profile?._id) {
        setStoredProfileId(res.data.profile._id);
    }
    return res.data;
};

export const updateCredentials = async (profileId, credentialData) => {
    const res = await api.patch(`/profiles/${profileId}/credentials`, credentialData);
    return res.data;
};

export const createProfile = async (profileData) => {
    const res = await api.post('/profiles', profileData);
    if (res.data?.token) {
        localStorage.setItem('fitcode_auth_token', res.data.token);
    }
    if (res.data?.profile?._id) {
        setStoredProfileId(res.data.profile._id);
    }
    return res.data;
};

export const getProfile = async (id) => {
    const res = await api.get(`/profiles/${id}`);
    return res.data;
};

export const updateProfile = async (id, updates) => {
    const updated = await api.patch(`/profiles/${id}`, updates);
    return updated.data;
};

export const getDietPlan = async (profileId) => {
    const res = await api.get(`/profiles/${profileId}/diet-plan`);
    return res.data;
};

export const generateDietPlan = async (profileId) => {
    const res = await api.post(`/profiles/${profileId}/diet-plan`);
    return res.data;
};

export const swapMealRecipeApi = async (profileId, mealId) => {
    const res = await api.post(`/profiles/${profileId}/diet-plan/swap-meal`, { mealId });
    return res.data;
};

export const getWorkoutPlan = async (profileId) => {
    const res = await api.get(`/profiles/${profileId}/workout-plan`);
    return res.data;
};

export const generateWorkoutPlan = async (profileId) => {
    const res = await api.post(`/profiles/${profileId}/workout-plan`);
    return res.data;
};

export const swapWorkoutExercise = async (profileId, dayLabel, exerciseId) => {
    const res = await api.post(`/profiles/${profileId}/workout-plan/swap`, { dayLabel, exerciseId });
    return res.data;
};

export const getExerciseDetail = async (exerciseId) => {
    const res = await api.get(`/exercises/${exerciseId}`);
    return res.data;
};

export const logDailyEntry = async (profileId, logData) => {
    const res = await api.post(`/profiles/${profileId}/logs`, logData);
    return res.data;
};

export const getLogs = async (profileId) => {
    const res = await api.get(`/profiles/${profileId}/logs`);
    return res.data;
};

export const getBadges = async (profileId) => {
    const res = await api.get(`/profiles/${profileId}/badges`);
    return res.data;
};

export const getAiTip = async (profileId) => {
    const res = await api.post(`/profiles/${profileId}/ai-tip`);
    return res.data;
};

// Recipe Dataset & Internet Resource Services
export const getRecommendedRecipes = async (profileId, mealType = '') => {
    const params = new URLSearchParams();
    if (profileId) params.append('profileId', profileId);
    if (mealType) params.append('mealType', mealType);
    const res = await api.get(`/recipes/recommendations?${params.toString()}`);
    return res.data;
};

export const uploadCustomRecipes = async (recipesArray) => {
    const res = await api.post('/recipes/custom-dataset', { recipes: recipesArray });
    return res.data;
};

export const getExternalDietResources = async () => {
    const res = await api.get('/recipes/external-resources');
    return res.data;
};

export const logMealApi = async (profileId, mealData) => {
    const res = await api.post(`/profiles/${profileId}/meals/log`, mealData);
    return res.data;
};

export const getMealLogsApi = async (profileId, dateStr = '') => {
    const params = dateStr ? `?date=${dateStr}` : '';
    const res = await api.get(`/profiles/${profileId}/meals/log${params}`);
    return res.data;
};

export const deleteMealLogApi = async (profileId, mealLogId) => {
    const res = await api.delete(`/profiles/${profileId}/meals/log/${mealLogId}`);
    return res.data;
};

// Medication & Reminder Services
export const getMedicationsApi = async (profileId) => {
    const res = await api.get(`/profiles/${profileId}/medications`);
    return res.data;
};

export const addMedicationApi = async (profileId, medData) => {
    const res = await api.post(`/profiles/${profileId}/medications`, medData);
    return res.data;
};

export const toggleMedicationApi = async (profileId, medId) => {
    const res = await api.patch(`/profiles/${profileId}/medications/${medId}/toggle`);
    return res.data;
};

export const deleteMedicationApi = async (profileId, medId) => {
    const res = await api.delete(`/profiles/${profileId}/medications/${medId}`);
    return res.data;
};

export default api;
