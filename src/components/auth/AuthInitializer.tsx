'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { loadUserFromToken, logout, setNotificationMessage } from '@/redux/reducers/authReducer';

export default function AuthInitializer() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        // Load user from token when app starts
        dispatch(loadUserFromToken());

        // Listen for logout event from axios interceptor
        const handleLogout = () => {
            dispatch(logout());
        };

        let logoutTimer: number | undefined;
        const TOAST_DURATION = 4000;

        const handleLogoutWithMessage = (event: CustomEvent) => {
            const message = event.detail?.message;
            if (message) {
                dispatch(setNotificationMessage(message));
            }

            if (typeof window !== 'undefined') {
                if (logoutTimer) {
                    window.clearTimeout(logoutTimer);
                }
                logoutTimer = window.setTimeout(() => {
                    dispatch(logout());
                }, TOAST_DURATION);
            }
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('auth:logout', handleLogout);
            window.addEventListener('auth:logout-with-message', handleLogoutWithMessage as EventListener);
        }

        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('auth:logout', handleLogout);
                window.removeEventListener('auth:logout-with-message', handleLogoutWithMessage as EventListener);
                if (logoutTimer) {
                    window.clearTimeout(logoutTimer);
                }
            }
        };
    }, [dispatch]);

    return null;
}
