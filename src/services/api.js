import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Single-session profile ID manager
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

// API Services
export const createProfile = async (profileData) => {
    const res = await api.post('/profiles', profileData);
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

export const getWorkoutPlan = async (profileId) => {
    const res = await api.get(`/profiles/${profileId}/workout-plan`);
    return res.data;
};

export const generateWorkoutPlan = async (profileId) => {
    const res = await api.post(`/profiles/${profileId}/workout-plan`);
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

export default api;
