/**
 * Settings.jsx — Admin role
 */
export default function Settings() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">⚙️ Settings</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">System configuration and preferences</p>
            </div>
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-12 text-center shadow-sm">
                <div className="text-6xl mb-4">⚙️</div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Settings Panel</h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                    System settings will be available for administrators once the configuration module is activated.
                </p>
                <div className="mt-6 inline-flex items-center px-4 py-2 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 text-amber-700 dark:text-amber-300 text-sm font-medium">
                    🔧 Coming Soon
                </div>
            </div>
        </div>
    );
}
