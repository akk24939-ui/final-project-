/**
 * Patients.jsx — Doctor / Admin / Staff — Patient Search
 * Uses real endpoints:
 *   GET /patient-records/search?query={12-digit ABHA/Aadhaar}
 *   GET /meds/adherence/{source}/{id}
 *   GET /rx/patient/{source}/{id}
 *   GET /medical-records/patient-records/{source}/{id}
 */
import { useState, useCallback } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

function Spinner() {
    return (
        <div className="flex items-center justify-center py-10">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-sky-600 border-t-transparent" />
        </div>
    );
}

function InfoRow({ label, value }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 py-2 border-b border-slate-100 dark:border-slate-700 last:border-0">
            <span className="text-xs text-slate-400 font-medium w-36 flex-shrink-0">{label}</span>
            <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">{value || '—'}</span>
        </div>
    );
}

export default function Patients() {
    const [query, setQuery] = useState('');
    const [patient, setPatient] = useState(null);
    const [records, setRecords] = useState([]);
    const [rx, setRx] = useState([]);
    const [loading, setLoading] = useState(false);
    const [tab, setTab] = useState('records');

    const search = useCallback(async () => {
        if (query.trim().length !== 12 || !/^\d+$/.test(query.trim())) {
            toast.error('Enter a 12-digit ABHA ID or Aadhaar number');
            return;
        }
        setLoading(true);
        setPatient(null);
        setRecords([]);
        setRx([]);
        try {
            const res = await api.get(`/patient-records/search?query=${query.trim()}`);
            const pt = res.data;
            setPatient(pt);
            const src = pt.source || 'registered';
            const [rxRes, recRes] = await Promise.allSettled([
                api.get(`/rx/patient/${src}/${pt.id}`),
                api.get(`/medical-records/patient-records/${src}/${pt.id}`),
            ]);
            if (rxRes.status === 'fulfilled') setRx(Array.isArray(rxRes.value.data) ? rxRes.value.data : []);
            if (recRes.status === 'fulfilled') setRecords(Array.isArray(recRes.value.data) ? recRes.value.data : []);
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Patient not found');
        } finally {
            setLoading(false);
        }
    }, [query]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">🩺 Patient Search</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Search by 12-digit ABHA ID or Aadhaar number</p>
            </div>

            {/* Search box */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
                <div className="flex flex-col sm:flex-row gap-3">
                    <input
                        value={query}
                        onChange={e => setQuery(e.target.value.replace(/\D/g, '').slice(0, 12))}
                        onKeyDown={e => e.key === 'Enter' && search()}
                        placeholder="Enter 12-digit ABHA ID or Aadhaar..."
                        className="flex-1 px-4 py-3 text-sm border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                    />
                    <button onClick={search}
                        className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm transition-colors shadow-sm">
                        🔍 Search Patient
                    </button>
                </div>
            </div>

            {loading && <Spinner />}

            {patient && !loading && (
                <>
                    {/* Patient profile card */}
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center gap-4 mb-5">
                            <div className="w-14 h-14 rounded-2xl bg-sky-600 flex items-center justify-center text-white text-xl font-black flex-shrink-0">
                                {patient.name?.[0] || '?'}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{patient.name}</h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${patient.source === 'registered'
                                            ? 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300'
                                            : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                                        }`}>
                                        {patient.source === 'registered' ? '🧑 Portal Patient' : '🏥 Hospital Patient'}
                                    </span>
                                    {patient.risk_level && (
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${patient.risk_level === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' :
                                                patient.risk_level === 'Medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' :
                                                    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                                            }`}>
                                            {patient.risk_level} Risk
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                            <InfoRow label="ABHA ID" value={patient.abha_id} />
                            <InfoRow label="Blood Group" value={patient.blood_group} />
                            <InfoRow label="Phone" value={patient.phone} />
                            <InfoRow label="Emergency Contact" value={patient.emergency_contact} />
                            <InfoRow label="Allergies" value={patient.allergies} />
                            <InfoRow label="Medical Notes" value={patient.medical_notes} />
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
                        <div className="flex border-b border-slate-200 dark:border-slate-700">
                            {[
                                { key: 'records', label: `📋 Medical Records (${records.length})` },
                                { key: 'rx', label: `💊 Prescriptions (${rx.length})` },
                            ].map(t => (
                                <button key={t.key} onClick={() => setTab(t.key)}
                                    className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 ${tab === t.key
                                            ? 'border-sky-600 text-sky-700 dark:text-sky-400'
                                            : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                                        }`}>
                                    {t.label}
                                </button>
                            ))}
                        </div>

                        <div className="p-5">
                            {tab === 'records' && (
                                records.length === 0
                                    ? <p className="text-center text-slate-400 py-8">No medical records found.</p>
                                    : <div className="space-y-3">
                                        {records.map(r => (
                                            <div key={r.id} className="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-4 border border-slate-200 dark:border-slate-600">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                                                        {r.file_category || r.uploaded_by_role || 'Record'}
                                                    </span>
                                                    <span className="text-xs text-slate-400">
                                                        {r.created_at ? new Date(r.created_at).toLocaleDateString('en-IN') : ''}
                                                    </span>
                                                </div>
                                                {r.diagnosis && <p className="text-slate-800 dark:text-slate-100 text-sm font-medium">{r.diagnosis}</p>}
                                                {r.suggestion && <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{r.suggestion}</p>}
                                                <div className="flex gap-4 mt-2 text-xs text-slate-400">
                                                    {r.sugar_level && <span>🩸 Sugar: {r.sugar_level}</span>}
                                                    {r.blood_pressure && <span>💓 BP: {r.blood_pressure}</span>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                            )}
                            {tab === 'rx' && (
                                rx.length === 0
                                    ? <p className="text-center text-slate-400 py-8">No prescriptions found.</p>
                                    : <div className="space-y-3">
                                        {rx.map(r => (
                                            <div key={r.id} className="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-4 border border-slate-200 dark:border-slate-600">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/30 px-2 py-0.5 rounded-full">{r.rx_number}</span>
                                                    <span className="text-xs text-slate-400">{new Date(r.created_at).toLocaleDateString('en-IN')}</span>
                                                </div>
                                                <p className="text-slate-800 dark:text-slate-100 font-semibold text-sm">{r.diagnosis}</p>
                                                <p className="text-slate-500 text-xs mt-1">Dr. {r.digital_signature || r.doctor_name} · {Array.isArray(r.medicines) ? r.medicines.length : 0} medicines</p>
                                            </div>
                                        ))}
                                    </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
