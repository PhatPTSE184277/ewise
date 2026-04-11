import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { login as loginService } from '@/services/AuthService';
import { getUserProfile } from '@/services/UserService';
import type { AuthState, UserProfile, LoginCredentials } from '../models/authModel';

const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    isFirstLogin: false,
    notificationMessage: null,
};

const FIRST_LOGIN_STORAGE_KEY = 'ewise_is_first_login';
const FIRST_LOGIN_EMAIL_STORAGE_KEY = 'ewise_first_login_email';

// Async thunk for login
export const login = createAsyncThunk(
    'auth/login',
    async ({ username, password }: LoginCredentials, { rejectWithValue }) => {
        try {
            const response = await loginService(username, password);
            const { accessToken, refreshToken, isFirstLogin } = response;
            
            // Save auth data to sessionStorage only so closing the tab/browser requires login again.
            sessionStorage.setItem('ewise_token', accessToken);
            sessionStorage.setItem('ewise_refresh_token', refreshToken);
            sessionStorage.setItem(FIRST_LOGIN_STORAGE_KEY, String(!!isFirstLogin));
            localStorage.removeItem('ewise_token');
            localStorage.removeItem('ewise_refresh_token');
            localStorage.removeItem(FIRST_LOGIN_STORAGE_KEY);
            localStorage.removeItem(FIRST_LOGIN_EMAIL_STORAGE_KEY);

            // Keep a fallback identifier for first-login forced reset flow.
            if (username) {
                sessionStorage.setItem(FIRST_LOGIN_EMAIL_STORAGE_KEY, username);
            }
            
            // Get user profile
            const userProfile = await getUserProfile();
            if (userProfile?.email) {
                sessionStorage.setItem(FIRST_LOGIN_EMAIL_STORAGE_KEY, userProfile.email);
            }
            
            return { token: accessToken, user: userProfile, isFirstLogin };
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message || 'Đăng nhập thất bại');
        }
    }
);

// Async thunk for loading user profile from token
export const loadUserFromToken = createAsyncThunk(
    'auth/loadUserFromToken',
    async (_, { rejectWithValue }) => {
        try {
            const token = sessionStorage.getItem('ewise_token');
            const isFirstLogin = sessionStorage.getItem(FIRST_LOGIN_STORAGE_KEY) === 'true';
            
            if (!token) {
                return rejectWithValue('No token found');
            }
            
            const userProfile = await getUserProfile();
            if (userProfile?.email) {
                sessionStorage.setItem(FIRST_LOGIN_EMAIL_STORAGE_KEY, userProfile.email);
            }
            
            return { token, user: userProfile, isFirstLogin };
        } catch (error: any) {
            localStorage.removeItem('ewise_token');
            sessionStorage.removeItem('ewise_token');
            localStorage.removeItem('ewise_refresh_token');
            sessionStorage.removeItem('ewise_refresh_token');
            localStorage.removeItem(FIRST_LOGIN_STORAGE_KEY);
            sessionStorage.removeItem(FIRST_LOGIN_STORAGE_KEY);
            localStorage.removeItem(FIRST_LOGIN_EMAIL_STORAGE_KEY);
            sessionStorage.removeItem(FIRST_LOGIN_EMAIL_STORAGE_KEY);
            return rejectWithValue(error?.response?.data?.message || 'Token không hợp lệ');
        }
    }
);

// Async thunk for logout
export const logout = createAsyncThunk('auth/logout', async () => {
    localStorage.removeItem('ewise_token');
    sessionStorage.removeItem('ewise_token');
    localStorage.removeItem('ewise_refresh_token');
    sessionStorage.removeItem('ewise_refresh_token');
    localStorage.removeItem(FIRST_LOGIN_STORAGE_KEY);
    sessionStorage.removeItem(FIRST_LOGIN_STORAGE_KEY);
    localStorage.removeItem(FIRST_LOGIN_EMAIL_STORAGE_KEY);
    sessionStorage.removeItem(FIRST_LOGIN_EMAIL_STORAGE_KEY);
    return null;
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setNotificationMessage: (state, action: PayloadAction<string | null>) => {
            state.notificationMessage = action.payload;
        },
        clearNotificationMessage: (state) => {
            state.notificationMessage = null;
        },
    },
    extraReducers: (builder) => {
        // Login
        builder.addCase(login.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(login.fulfilled, (state, action: PayloadAction<{ token: string; user: UserProfile; isFirstLogin: boolean }>) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.token = action.payload.token;
            state.user = action.payload.user;
            state.error = null;
            state.isFirstLogin = action.payload.isFirstLogin;
            state.notificationMessage = null;
        });
        builder.addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.token = null;
            state.user = null;
            state.isFirstLogin = false;
            state.error = action.payload as string;
        });

        // Load user from token
        builder.addCase(loadUserFromToken.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(loadUserFromToken.fulfilled, (state, action: PayloadAction<{ token: string; user: UserProfile; isFirstLogin: boolean }>) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.token = action.payload.token;
            state.user = action.payload.user;
            state.isFirstLogin = action.payload.isFirstLogin;
            state.error = null;
        });
        builder.addCase(loadUserFromToken.rejected, (state) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.token = null;
            state.user = null;
            state.isFirstLogin = false;
        });

        // Logout
        builder.addCase(logout.fulfilled, (state) => {
            state.isAuthenticated = false;
            state.token = null;
            state.user = null;
            state.error = null;
            state.isFirstLogin = false;
        });
    },
});

export const { clearError } = authSlice.actions;
export const { setNotificationMessage, clearNotificationMessage } = authSlice.actions;
export default authSlice.reducer;
