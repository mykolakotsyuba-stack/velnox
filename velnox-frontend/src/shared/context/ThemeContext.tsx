'use client';

import { createContext, useContext, useEffect } from 'react';

type Theme = 'engineering-clean';

interface ThemeContextProps {
    theme: Theme;
    logoPath: string;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

const FIXED_THEME: Theme = 'engineering-clean';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        document.body.setAttribute('data-theme', FIXED_THEME);
    }, []);

    return (
        <ThemeContext.Provider value={{
            theme: FIXED_THEME,
            setTheme: () => {},
            logoPath: '/velnox/images/velnox-logo-white.png',
        }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
