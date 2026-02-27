import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const user = await login(data.hospital_id, data.username, data.password);
            toast.success(`Welcome back, ${user.full_name || user.username}!`);
            const routes = { admin: '/admin', doctor: '/doctor', staff: '/staff' };
            setTimeout(() => navigate(routes[user.role] || '/admin'), 600);
        } catch (err) {
            const msg = err.response?.data?.detail || 'Invalid credentials. Please try again.';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-4">
            <Toaster position="top-center" />

            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sky-600 shadow-lg mb-4">
                        <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">VitaSage AI</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Hospital Staff Portal</p>
                </div>

                {/* Card */}
                <div className="login-card">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-6">Sign In</h2>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Hospital ID */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Hospital ID</label>
                            <input
                                {...register('hospital_id', { required: 'Hospital ID is required' })}
                                className="medical-input"
                                placeholder="e.g. HSP001"
                            />
                            {errors.hospital_id && <p className="text-red-500 text-xs mt-1">{errors.hospital_id.message}</p>}
                        </div>

                        {/* Username */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Username</label>
                            <input
                                {...register('username', { required: 'Username is required' })}
                                className="medical-input"
                                placeholder="Enter your username"
                            />
                            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
                            <input
                                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })}
                                type="password"
                                className="medical-input"
                                placeholder="••••••••"
                            />
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                        </div>

                        <button type="submit" disabled={loading} className="w-full medical-btn mt-2 flex items-center justify-center gap-2">
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                    </svg>
                                    Authenticating...
                                </>
                            ) : 'Secure Sign In'}
                        </button>
                    </form>

                    {/* Demo credentials */}
                    <div className="mt-6 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
                        <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mb-1.5">🔑 Demo Credentials</p>
                        <div className="space-y-0.5 text-xs text-slate-500 dark:text-slate-400">
                            <p><span className="text-sky-600 dark:text-sky-400 font-medium">Admin:</span> HSP001 / admin / Admin@123</p>
                            <p><span className="text-sky-600 dark:text-sky-400 font-medium">Doctor:</span> HSP001 / dr.smith / Admin@123</p>
                            <p><span className="text-emerald-600 dark:text-emerald-400 font-medium">Staff:</span> HSP001 / staff01 / Admin@123</p>
                        </div>
                    </div>
                </div>

                <p className="text-center text-slate-400 dark:text-slate-600 text-xs mt-6">
                    <button onClick={() => navigate('/patient-login')} className="hover:text-sky-600 transition-colors">Patient Portal →</button>
                    &nbsp;·&nbsp; © 2026 VitaSage AI · HIPAA Compliant
                </p>
            </div>
        </div>
    );
}
