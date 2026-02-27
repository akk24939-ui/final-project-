import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DrAIButton from '../components/DrAIButton';
import { useTheme } from '../contexts/ThemeContext';

const CREATORS = ['AKASH K.K', 'P. VAIRAVAN', 'S. M. PREETHUKAN'];

const ABHA_BENEFITS = [
    { icon: '📋', text: 'Store medical records digitally' },
    { icon: '🔗', text: 'Share health data securely with doctors' },
    { icon: '🚨', text: 'Access emergency medical information instantly' },
    { icon: '📵', text: 'Avoid carrying physical reports' },
    { icon: '🏥', text: 'Paperless hospital access nationwide' },
];

const ABHA_STEPS = [
    { step: '01', label: 'Aadhaar Number', icon: '🪪' },
    { step: '02', label: 'Driving License', icon: '🚗' },
    { step: '03', label: 'Mobile OTP Verification', icon: '📱' },
];

const FEATURES = [
    { icon: '🔐', title: 'Role-Based Access', desc: 'Admin, Doctor, Staff with strict permission walls' },
    { icon: '🧠', title: 'AI-Powered Insights', desc: 'Intelligent health risk detection and alerts' },
    { icon: '📂', title: 'Cloud Records', desc: 'Drive-style medical report management' },
    { icon: '🩺', title: 'ABHA Integration', desc: "Linked to India's national health identity" },
    { icon: '⚡', title: 'Emergency Ready', desc: 'Instant high-risk patient alerts for doctors' },
    { icon: '🔒', title: 'JWT Security', desc: 'End-to-end encrypted token authentication' },
];

// ─────────────────────────────────────────────────────────────
//  DARK LANDING  (unchanged — deep space glassmorphism)
// ─────────────────────────────────────────────────────────────
function DarkLanding({ navigate, canvasRef }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-950 to-purple-950 relative overflow-x-hidden font-sans">
            <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none opacity-60 z-0" />
            <div className="fixed top-[-200px] left-[-200px] w-[600px] h-[600px] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none z-0" />
            <div className="fixed bottom-[-200px] right-[-200px] w-[600px] h-[600px] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none z-0" />
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-indigo-600/10 blur-[150px] pointer-events-none z-0" />

            {/* NAV */}
            <nav className="relative z-20 flex items-center justify-between px-8 py-5 border-b border-white/5 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-lg font-black shadow-lg shadow-blue-500/30">V</div>
                    <div>
                        <span className="text-white font-extrabold text-lg tracking-tight">VitaSage AI</span>
                        <span className="text-white/30 text-xs block leading-none">Digital Health Ecosystem</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <a href="#abha" className="text-white/50 hover:text-white text-sm transition-colors hidden md:block">ABHA Guide</a>
                    <a href="#about" className="text-white/50 hover:text-white text-sm transition-colors hidden md:block">About</a>
                    <button onClick={() => navigate('/login')} className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white text-sm font-medium transition-all">Sign In</button>
                </div>
            </nav>

            {/* HERO */}
            <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-20 pb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold tracking-widest uppercase mb-8">
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />India's AI Healthcare Platform
                </div>
                <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.1] tracking-tight max-w-5xl mb-6">
                    VitaSage{' '}<span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">AI</span>
                </h1>
                <p className="text-xl md:text-2xl text-white/60 font-light max-w-3xl mb-4">Revolutionizing Intelligent Healthcare Through Secure Digital Identity</p>
                <p className="text-white/30 text-sm max-w-xl mb-12">Powered by ABHA · Built on India's National Health Mission · Secured by JWT</p>

                {/* Creator Card */}
                <div className="relative mb-14 w-full max-w-2xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 via-purple-600/30 to-pink-600/30 blur-2xl rounded-3xl" />
                    <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
                        <p className="text-white/40 text-xs font-semibold tracking-[0.3em] uppercase mb-5">🚀 Developed By</p>
                        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                            {CREATORS.map((name, i) => (
                                <div key={name} className="flex flex-col items-center gap-2">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-purple-500/30">{name[0]}</div>
                                    <p className="text-white font-extrabold text-lg md:text-xl tracking-wide uppercase" style={{ textShadow: '0 0 30px rgba(147,197,253,0.5)' }}>{name}</p>
                                    <span className="text-xs text-blue-400/60 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/10">
                                        {i === 0 ? 'Lead Developer' : i === 1 ? 'Backend Engineer' : 'UI/UX Designer'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mb-4 w-full max-w-lg">
                    <button onClick={() => navigate('/patient-login')} className="flex-1 group relative overflow-hidden px-8 py-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-lg shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-300">
                        <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="flex items-center justify-center gap-3"><span className="text-2xl">🧑</span><span><span className="block text-sm font-normal text-white/70">For Patients</span>Patient Portal</span></span>
                    </button>
                    <button onClick={() => navigate('/login')} className="flex-1 group relative overflow-hidden px-8 py-5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300">
                        <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="flex items-center justify-center gap-3"><span className="text-2xl">🏥</span><span><span className="block text-sm font-normal text-white/70">Admin · Doctor · Staff</span>Hospital Access</span></span>
                    </button>
                </div>
                <p className="text-white/20 text-xs">Both portals secured with JWT authentication &amp; RBAC</p>
            </section>

            {/* FEATURES */}
            <section id="about" className="relative z-10 px-6 py-16 max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <p className="text-blue-400/60 text-xs tracking-widest uppercase mb-3">Platform Features</p>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white">About the Project</h2>
                    <p className="text-white/40 text-base mt-4 max-w-3xl mx-auto">VitaSage AI is an AI-powered hospital and patient management ecosystem designed to integrate digital health identity, emergency response intelligence, and secure cloud-based medical record management. The system connects doctors, staff, and patients using structured role-based access and ABHA-linked digital records for faster and safer treatment.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {FEATURES.map(f => (
                        <div key={f.title} className="group backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] transition-all duration-300 cursor-default">
                            <div className="text-3xl mb-3">{f.icon}</div>
                            <h3 className="text-white font-bold mb-1">{f.title}</h3>
                            <p className="text-white/40 text-sm">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ABHA SECTION */}
            <section id="abha" className="relative z-10 px-6 py-20 max-w-6xl mx-auto">
                <div className="backdrop-blur-xl bg-white/5 border border-blue-500/20 rounded-3xl p-10 md:p-16 shadow-2xl">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs tracking-widest uppercase mb-5">Government of India Initiative</div>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">What is <span className="text-blue-400">ABHA ID</span>?</h2>
                        <p className="text-white/50 text-base max-w-2xl mx-auto"><strong className="text-white">ABHA</strong> (Ayushman Bharat Health Account) is a unique <span className="text-blue-400 font-bold">14-digit digital health ID</span> introduced under the <span className="text-white font-semibold">Ayushman Bharat Digital Mission</span>, managed by the National Health Authority of India.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                        {ABHA_BENEFITS.map(b => (
                            <div key={b.text} className="flex items-center gap-4 bg-white/5 rounded-xl px-5 py-4 border border-white/5">
                                <span className="text-2xl">{b.icon}</span>
                                <p className="text-white/70 text-sm">{b.text}</p>
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-wrap gap-3 justify-center mb-12">
                        {['Secure', 'Government-Approved', 'Portable Health Identity', 'Paperless Access', 'Emergency-Ready'].map(tag => (
                            <span key={tag} className="px-4 py-2 rounded-full bg-blue-500/15 border border-blue-500/25 text-blue-300 text-sm font-medium">✔ {tag}</span>
                        ))}
                    </div>
                    <div className="mb-12">
                        <p className="text-white/40 text-xs tracking-widest uppercase text-center mb-6">How to Create Your ABHA ID</p>
                        <div className="flex flex-col md:flex-row gap-4 justify-center">
                            {ABHA_STEPS.map((s, i) => (
                                <div key={s.step} className="flex-1 bg-white/5 rounded-2xl p-5 border border-white/5 text-center relative">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-black text-sm mx-auto mb-3">{s.step}</div>
                                    <p className="text-2xl mb-2">{s.icon}</p>
                                    <p className="text-white text-sm font-semibold">{s.label}</p>
                                    {i < ABHA_STEPS.length - 1 && <div className="hidden md:block absolute right-[-12px] top-1/2 -translate-y-1/2 text-white/20 text-xl z-10">→</div>}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="text-center">
                        <p className="text-white/40 text-sm mb-4">Register your free ABHA ID on the official government portal</p>
                        <a href="https://abha.abdm.gov.in/abha/v3/register" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-base hover:scale-105 transition-all duration-300 shadow-xl shadow-blue-500/30">
                            <span>🔗</span>Register ABHA ID — Official Portal<span className="text-white/60 text-xs">↗</span>
                        </a>
                        <p className="text-white/20 text-xs mt-3">abha.abdm.gov.in · National Health Authority, Govt. of India</p>
                    </div>
                </div>
            </section>

            {/* SYSTEM OVERVIEW */}
            <section className="relative z-10 px-6 py-12 max-w-6xl mx-auto">
                <div className="text-center mb-8">
                    <p className="text-white/30 text-xs tracking-widest uppercase mb-2">System Architecture</p>
                    <h3 className="text-white text-2xl font-bold">Your Health. Your Data. Your Control.</h3>
                </div>
                <div className="flex flex-col md:flex-row items-center justify-center gap-3 text-sm flex-wrap">
                    {[
                        { label: 'Landing Page', icon: '🌐', color: 'from-slate-600 to-slate-700' },
                        { label: '→', icon: null }, { label: 'Hospital Login', icon: '🏥', color: 'from-blue-700 to-blue-800' },
                        { label: '→', icon: null }, { label: 'Admin Dashboard', icon: '👤', color: 'from-purple-700 to-purple-800' },
                        { label: '', icon: null }, { label: 'Doctor Portal', icon: '🩺', color: 'from-cyan-700 to-cyan-800' },
                        { label: '', icon: null }, { label: 'Staff Dashboard', icon: '👩‍⚕️', color: 'from-emerald-700 to-emerald-800' },
                    ].map((item, i) =>
                        item.icon ? (
                            <div key={i} className={`px-4 py-2.5 rounded-xl bg-gradient-to-r ${item.color} text-white font-medium flex items-center gap-2 shadow-lg`}>
                                <span>{item.icon}</span><span>{item.label}</span>
                            </div>
                        ) : item.label ? <span key={i} className="text-white/20 text-xl font-light">{item.label}</span> : <div key={i} />
                    )}
                </div>
            </section>

            {/* FOOTER */}
            <footer className="relative z-10 border-t border-white/5 mt-12 py-10 px-6 text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-black text-white">V</div>
                    <span className="text-white font-bold">VitaSage AI</span>
                </div>
                <p className="text-white/30 text-xs max-w-2xl mx-auto mb-4">VitaSage AI is an academic innovation project developed for educational and research demonstration purposes. This system assists healthcare professionals and does not replace certified medical advice.</p>
                <div className="flex flex-wrap justify-center gap-4 text-white/20 text-xs mb-4">{CREATORS.map(n => <span key={n}>👨‍💻 {n}</span>)}</div>
                <p className="text-white/10 text-xs">Built with FastAPI · React · PostgreSQL · Tailwind CSS · ABHA Integration</p>
            </footer>
            <DrAIButton />
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
//  LIGHT LANDING  — Full premium white/sky hospital design
// ─────────────────────────────────────────────────────────────
function LightLanding({ navigate }) {
    return (
        <div className="min-h-screen bg-white font-sans overflow-x-hidden">

            {/* ── NAV ───────────────────────────────────────── */}
            <nav className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center shadow-sm flex-shrink-0">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <div>
                            <span className="text-sky-700 font-extrabold text-lg tracking-tight">VitaSage AI</span>
                            <span className="text-slate-400 text-xs block leading-none">Digital Health Ecosystem</span>
                        </div>
                    </div>
                    {/* Nav links */}
                    <div className="hidden md:flex items-center gap-6">
                        <a href="#features" className="text-slate-500 hover:text-sky-600 text-sm font-medium transition-colors">Features</a>
                        <a href="#abha" className="text-slate-500 hover:text-sky-600 text-sm font-medium transition-colors">ABHA Guide</a>
                        <a href="#about" className="text-slate-500 hover:text-sky-600 text-sm font-medium transition-colors">About</a>
                    </div>
                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate('/patient-login')}
                            className="hidden sm:block px-4 py-2 text-sm font-semibold text-sky-600 hover:text-sky-700 border border-sky-200 hover:border-sky-400 rounded-lg transition-all">
                            Patient Portal
                        </button>
                        <button onClick={() => navigate('/login')}
                            className="px-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold shadow-sm shadow-sky-200 transition-all">
                            Hospital Login
                        </button>
                    </div>
                </div>
            </nav>

            {/* ── HERO ──────────────────────────────────────── */}
            <section className="relative bg-gradient-to-b from-sky-50 to-white overflow-hidden">
                {/* Decorative blobs */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-100 rounded-full blur-[120px] opacity-60 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-100 rounded-full blur-[100px] opacity-40 pointer-events-none" />

                <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28 text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-100 border border-sky-200 text-sky-700 text-xs font-bold tracking-widest uppercase mb-8">
                        <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                        India's AI Healthcare Platform
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tight max-w-4xl mx-auto mb-6">
                        Smarter Healthcare,<br />
                        <span className="text-sky-600">Powered by AI</span>
                    </h1>
                    <p className="text-xl text-slate-500 font-light max-w-2xl mx-auto mb-3">
                        VitaSage AI — India's most intelligent hospital &amp; patient management system, ABHA-linked and AI-ready.
                    </p>
                    <p className="text-slate-400 text-sm mb-12">
                        Powered by ABHA · Built on India's National Health Mission · Secured by JWT
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto mb-6">
                        <button onClick={() => navigate('/patient-login')}
                            className="flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-lg shadow-emerald-200 hover:shadow-emerald-300 hover:-translate-y-0.5 transition-all duration-200">
                            <span className="text-xl">🧑</span>
                            <span>
                                <span className="block text-xs font-normal text-white/70">For Patients</span>
                                Patient Portal
                            </span>
                        </button>
                        <button onClick={() => navigate('/login')}
                            className="flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-base shadow-lg shadow-sky-200 hover:shadow-sky-300 hover:-translate-y-0.5 transition-all duration-200">
                            <span className="text-xl">🏥</span>
                            <span>
                                <span className="block text-xs font-normal text-white/70">Admin · Doctor · Staff</span>
                                Hospital Access
                            </span>
                        </button>
                    </div>
                    <p className="text-slate-400 text-xs">Both portals secured with JWT authentication &amp; RBAC</p>

                    {/* Stats row */}
                    <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
                        {[
                            { val: 'ABHA', sub: 'Integrated' },
                            { val: 'JWT', sub: 'Secured' },
                            { val: 'AI', sub: 'Powered' },
                            { val: 'NHA', sub: 'Compliant' },
                        ].map(s => (
                            <div key={s.val} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                                <p className="text-2xl font-black text-sky-600">{s.val}</p>
                                <p className="text-slate-400 text-xs mt-0.5">{s.sub}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CREATOR CARD ──────────────────────────────── */}
            <section className="bg-slate-50 border-y border-slate-200 py-16 px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <p className="text-slate-400 text-xs font-bold tracking-widest uppercase mb-8">🚀 Developed By</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                        {CREATORS.map((name, i) => (
                            <div key={name} className="flex flex-col items-center gap-3">
                                <div className="w-14 h-14 rounded-2xl bg-sky-600 flex items-center justify-center text-white font-black text-xl shadow-sm">
                                    {name[0]}
                                </div>
                                <div>
                                    <p className="text-slate-800 font-extrabold text-base tracking-wide uppercase">{name}</p>
                                    <span className="text-xs text-sky-600 font-medium">
                                        {i === 0 ? 'Lead Developer' : i === 1 ? 'Backend Engineer' : 'UI/UX Designer'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FEATURES ──────────────────────────────────── */}
            <section id="features" className="py-20 px-6 max-w-6xl mx-auto">
                <div className="text-center mb-14">
                    <span className="inline-block px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-xs font-bold uppercase tracking-widest mb-4">Platform Features</span>
                    <h2 className="text-4xl font-extrabold text-slate-900">Built for Modern Healthcare</h2>
                    <p className="text-slate-500 mt-4 max-w-2xl mx-auto">
                        VitaSage AI connects doctors, staff, and patients through structured role-based access and ABHA-linked digital records for faster and safer treatment.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {FEATURES.map(f => (
                        <div key={f.title}
                            className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-sky-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default group">
                            <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-2xl mb-4 group-hover:bg-sky-100 transition-colors">
                                {f.icon}
                            </div>
                            <h3 className="text-slate-800 font-bold text-base mb-1">{f.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── ABHA SECTION ──────────────────────────────── */}
            <section id="abha" className="bg-gradient-to-br from-sky-600 to-blue-700 py-20 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-14">
                        <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 text-white text-xs font-bold tracking-widest uppercase mb-5">Government of India Initiative</span>
                        <h2 className="text-4xl font-extrabold text-white mb-4">
                            What is <span className="text-sky-200">ABHA ID</span>?
                        </h2>
                        <p className="text-white/80 max-w-2xl mx-auto text-base">
                            <strong>ABHA</strong> (Ayushman Bharat Health Account) is a unique <span className="font-bold text-sky-200">14-digit digital health ID</span> under the Ayushman Bharat Digital Mission, managed by the National Health Authority of India.
                        </p>
                    </div>

                    {/* Benefits grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                        {ABHA_BENEFITS.map(b => (
                            <div key={b.text} className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl px-5 py-4 border border-white/20 hover:bg-white/15 transition-colors">
                                <span className="text-2xl flex-shrink-0">{b.icon}</span>
                                <p className="text-white font-medium text-sm">{b.text}</p>
                            </div>
                        ))}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-3 justify-center mb-12">
                        {['Secure', 'Government-Approved', 'Portable Health Identity', 'Paperless Access', 'Emergency-Ready'].map(tag => (
                            <span key={tag} className="px-4 py-2 rounded-full bg-white/20 border border-white/30 text-white text-sm font-medium">✔ {tag}</span>
                        ))}
                    </div>

                    {/* Steps */}
                    <p className="text-white/60 text-xs tracking-widest uppercase text-center mb-6">How to Create Your ABHA ID</p>
                    <div className="flex flex-col md:flex-row gap-4 justify-center mb-12">
                        {ABHA_STEPS.map((s, i) => (
                            <div key={s.step} className="flex-1 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center relative">
                                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white font-black text-sm mx-auto mb-3">{s.step}</div>
                                <p className="text-3xl mb-2">{s.icon}</p>
                                <p className="text-white font-semibold text-sm">{s.label}</p>
                                {i < ABHA_STEPS.length - 1 && (
                                    <div className="hidden md:block absolute right-[-16px] top-1/2 -translate-y-1/2 text-white/40 text-xl z-10">→</div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="text-center">
                        <p className="text-white/60 text-sm mb-5">Register your free ABHA ID on the official government portal</p>
                        <a href="https://abha.abdm.gov.in/abha/v3/register" target="_blank" rel="noreferrer"
                            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-sky-700 font-bold text-base hover:bg-sky-50 hover:-translate-y-0.5 transition-all duration-200 shadow-xl">
                            🔗 Register ABHA ID — Official Portal <span className="text-sky-400 text-xs">↗</span>
                        </a>
                        <p className="text-white/30 text-xs mt-4">abha.abdm.gov.in · National Health Authority, Govt. of India</p>
                    </div>
                </div>
            </section>

            {/* ── SYSTEM OVERVIEW ───────────────────────────── */}
            <section id="about" className="py-20 px-6 bg-white">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-bold uppercase tracking-widest mb-4">System Architecture</span>
                        <h3 className="text-3xl font-extrabold text-slate-900">Your Health. Your Data. Your Control.</h3>
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-3 flex-wrap">
                        {[
                            { label: 'Landing Page', icon: '🌐', bg: 'bg-slate-100 text-slate-700 border-slate-200' },
                            { label: '→', icon: null },
                            { label: 'Hospital Login', icon: '🏥', bg: 'bg-sky-50 text-sky-700 border-sky-200' },
                            { label: '→', icon: null },
                            { label: 'Admin Dashboard', icon: '👤', bg: 'bg-violet-50 text-violet-700 border-violet-200' },
                            { label: '', icon: null },
                            { label: 'Doctor Portal', icon: '🩺', bg: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
                            { label: '', icon: null },
                            { label: 'Staff Dashboard', icon: '👩‍⚕️', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                        ].map((item, i) =>
                            item.icon ? (
                                <div key={i} className={`px-5 py-3 rounded-xl border font-semibold flex items-center gap-2 text-sm shadow-sm ${item.bg}`}>
                                    <span>{item.icon}</span><span>{item.label}</span>
                                </div>
                            ) : item.label ? (
                                <span key={i} className="text-slate-300 text-2xl font-light">{item.label}</span>
                            ) : <div key={i} />
                        )}
                    </div>

                    {/* Patient Portal card */}
                    <div className="mt-8 bg-sky-50 border border-sky-200 rounded-2xl p-6 text-center">
                        <p className="text-sky-600 text-xs font-bold uppercase tracking-widest mb-2">Also Available</p>
                        <p className="text-slate-700 font-semibold">Patient Portal — Direct patient access via ABHA-linked login</p>
                        <button onClick={() => navigate('/patient-login')}
                            className="mt-4 px-6 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold transition-colors shadow-sm">
                            Open Patient Portal →
                        </button>
                    </div>
                </div>
            </section>

            {/* ── FOOTER ────────────────────────────────────── */}
            <footer className="bg-slate-900 text-white py-12 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="flex items-center justify-center gap-3 mb-5">
                        <div className="w-9 h-9 rounded-xl bg-sky-600 flex items-center justify-center text-white font-black shadow-sm">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <span className="font-bold text-lg">VitaSage AI</span>
                    </div>
                    <p className="text-slate-400 text-xs max-w-2xl mx-auto mb-5">
                        VitaSage AI is an academic innovation project developed for educational and research demonstration purposes. This system assists healthcare professionals and does not replace certified medical advice.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 text-slate-500 text-xs mb-5">
                        {CREATORS.map(n => <span key={n}>👨‍💻 {n}</span>)}
                    </div>
                    <div className="flex flex-wrap justify-center gap-2 mb-5">
                        {['FastAPI', 'React', 'PostgreSQL', 'Tailwind CSS', 'ABHA Integration'].map(t => (
                            <span key={t} className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-xs">{t}</span>
                        ))}
                    </div>
                    <p className="text-slate-600 text-xs">© 2026 VitaSage AI · All Rights Reserved</p>
                </div>
            </footer>

            <DrAIButton />
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
//  ROOT — picks the right landing based on theme
// ─────────────────────────────────────────────────────────────
export default function Landing() {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const canvasRef = useRef(null);

    // Animated floating particles — only for dark mode
    useEffect(() => {
        if (theme !== 'dark') return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const particles = Array.from({ length: 60 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 2 + 0.5,
            dx: (Math.random() - 0.5) * 0.4,
            dy: (Math.random() - 0.5) * 0.4,
            o: Math.random() * 0.4 + 0.1,
        }));
        let raf;
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(147,197,253,${p.o})`;
                ctx.fill();
                p.x += p.dx; p.y += p.dy;
                if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
            });
            raf = requestAnimationFrame(draw);
        };
        draw();
        const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
        window.addEventListener('resize', resize);
        return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
    }, [theme]);

    if (theme === 'dark') {
        return <DarkLanding navigate={navigate} canvasRef={canvasRef} />;
    }
    return <LightLanding navigate={navigate} />;
}
