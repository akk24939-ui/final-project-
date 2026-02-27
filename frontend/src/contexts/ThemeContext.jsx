import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    // 'light' = professional clean hospital UI (default)
    // 'dark'  = dark mode via Tailwind dark: prefix
    const [theme, setTheme] = useState(() => {
        try {
            return localStorage.getItem('vs_theme') || 'light';
        } catch {
            return 'light';
        }
    });

    useEffect(() => {
        localStorage.setItem('vs_theme', theme);
        // Tailwind dark mode — toggle 'dark' class on <html>
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
