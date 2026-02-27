/**
 * Labs.jsx — Doctor / Staff — Lab Reports
 * Uses real endpoints from lab_reports.py:
 *   GET /lab/patient/{source}/{id}   → view lab reports for a patient
 *   Staff can also upload via /lab/upload (staff only)
 */
import { useState, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

function Spinner() {
    return (
        <div className="flex items-center justify-center py-10">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-sky-600 border-t-transparent" />
        </div>
    );
}

export default function Labs() {
    const { user } = useAuth();
    const canUpload = user?.role === 'staff' || user?.role === 'doctor';

    const [query, setQuery] = useState('');
    const [patient, setPatient] = useState(null);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [showUpload, setShowUpload] = useState(false);
    const [uploadForm, setUploadForm] = useState({
        test_name: '', hemoglobin: '', wbc: '', platelets: '',
        sugar_fasting: '', blood_pressure: '', creatinine: '',
        uric_acid: '', cholesterol: '', thyroid_tsh: '', vitamin_d: '', remarks: ''
    });
    const [file, setFile] = useState(null);

    const searchPatient = useCallback(async () => {
        if (query.trim().length !== 12 || !/^\d+$/.test(query.trim())) {
            toast.error('Enter a 12-digit ABHA ID or Aadhaar number');
            return;
        }
        setLoading(true);
        setPatient(null);
        setReports([]);
        try {
            const res = await api.get(`/patient-records/search?query=${query.trim()}`);
            const pt = res.data;
            setPatient(pt);
            const src = pt.source || 'registered';
            const rRes = await api.get(`/lab/patient/${src}/${pt.id}`);
            setReports(Array.isArray(rRes.data) ? rRes.data : []);
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Patient not found');
        } finally {
            setLoading(false);
        }
    }, [query]);

    const uploadReport = async () => {
        if (!patient) return;
        if (!uploadForm.test_name.trim()) { toast.error('Test name is required'); return; }
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append('patient_id', patient.id);
            fd.append('patient_source', patient.source || 'registered');
            Object.entries(uploadForm).forEach(([k, v]) => { if (v?.trim()) fd.append(k, v); });
            if (file) fd.append('file', file);
            await api.post('/lab/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            toast.success('Lab report uploaded successfully!');
            setShowUpload(false);
            setUploadForm({ test_name: '', hemoglobin: '', wbc: '', platelets: '', sugar_fasting: '', blood_pressure: '', creatinine: '', uric_acid: '', cholesterol: '', thyroid_tsh: '', vitamin_d: '', remarks: '' });
            setFile(null);
            // Refresh reports
            const rRes = await api.get(`/lab/patient/${patient.source || 'registered'}/${patient.id}`);
            setReports(Array.isArray(rRes.data) ? rRes.data : []);
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">🧪 Lab Reports</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                    {canUpload ? 'Search patient and upload or view lab reports' : 'Search patient to view lab reports'}
                </p>
            </div>

            {/* Search */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
                <div className="flex flex-col sm:flex-row gap-3">
                    <input
                        value={query}
                        onChange={e => setQuery(e.target.value.replace(/\D/g, '').slice(0, 12))}
                        onKeyDown={e => e.key === 'Enter' && searchPatient()}
                        placeholder="Enter 12-digit ABHA ID or Aadhaar..."
                        className="flex-1 px-4 py-3 text-sm border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                    />
                    <button onClick={searchPatient}
                        className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm transition-colors">
                        🔍 Find Patient
                    </button>
                </div>
            </div>

            {loading && <Spinner />}

            {patient && !loading && (
                <>
                    {/* Patient chip */}
                    <div className="bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-700/50 rounded-xl px-5 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-sky-600 flex items-center justify-center text-white font-bold flex-shrink-0">{patient.name?.[0]}</div>
                            <div>
                                <p className="font-semibold text-slate-800 dark:text-slate-100">{patient.name}</p>
                                <p className="text-xs text-sky-600 dark:text-sky-400 font-mono">{patient.abha_id}</p>
                            </div>
                        </div>
                        {canUpload && (
                            <button onClick={() => setShowUpload(!showUpload)}
                                className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold transition-colors">
                                ➕ Upload Lab Report
                            </button>
                        )}
                    </div>

                    {/* Upload form (staff only) */}
                    {showUpload && canUpload && (
                        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm space-y-4">
                            <h3 className="font-semibold text-slate-800 dark:text-slate-100">📤 Upload Lab Report for {patient.name}</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {[
                                    { key: 'test_name', label: 'Test Name *' },
                                    { key: 'hemoglobin', label: 'Hemoglobin (g/dL)' },
                                    { key: 'wbc', label: 'WBC (/mcL)' },
                                    { key: 'platelets', label: 'Platelets (/mcL)' },
                                    { key: 'sugar_fasting', label: 'Sugar Fasting (mg/dL)' },
                                    { key: 'blood_pressure', label: 'Blood Pressure (mmHg)' },
                                    { key: 'creatinine', label: 'Creatinine (mg/dL)' },
                                    { key: 'uric_acid', label: 'Uric Acid (mg/dL)' },
                                    { key: 'cholesterol', label: 'Cholesterol (mg/dL)' },
                                    { key: 'thyroid_tsh', label: 'Thyroid TSH (mIU/L)' },
                                    { key: 'vitamin_d', label: 'Vitamin D (ng/mL)' },
                                    { key: 'remarks', label: 'Remarks' },
                                ].map(f => (
                                    <div key={f.key}>
                                        <label className="text-xs text-slate-500 mb-1 block">{f.label}</label>
                                        <input
                                            value={uploadForm[f.key]}
                                            onChange={e => setUploadForm(p => ({ ...p, [f.key]: e.target.value }))}
                                            className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                                        />
                                    </div>
                                ))}
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 mb-1 block">Attach Report File (optional)</label>
                                <input type="file" accept=".pdf,image/*" onChange={e => setFile(e.target.files[0])}
                                    className="w-full text-sm text-slate-600 dark:text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-sky-100 file:text-sky-700 hover:file:bg-sky-200" />
                            </div>
                            <div className="flex gap-3">
                                <button onClick={uploadReport} disabled={uploading}
                                    className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-60 text-white font-semibold text-sm transition-colors">
                                    {uploading ? 'Uploading...' : '📤 Upload Report'}
                                </button>
                                <button onClick={() => setShowUpload(false)}
                                    className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 font-semibold text-sm transition-colors">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Lab reports list */}
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700">
                            <h2 className="font-semibold text-slate-800 dark:text-slate-100">Lab Reports ({reports.length})</h2>
                        </div>
                        <div className="p-5">
                            {reports.length === 0 ? (
                                <div className="text-center py-10">
                                    <div className="text-4xl mb-3">🧪</div>
                                    <p className="text-slate-500 dark:text-slate-400 font-medium">No lab reports found.</p>
                                    {isStaff && <p className="text-slate-400 text-sm mt-1">Upload the first report using the button above.</p>}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {reports.map(r => (
                                        <div key={r.id} className="border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <div>
                                                    <p className="font-semibold text-slate-800 dark:text-slate-100">{r.test_name}</p>
                                                    <p className="text-xs text-slate-400 mt-0.5">By {r.staff_name || 'Unknown'} · {r.created_at ? new Date(r.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}</p>
                                                </div>
                                                {r.file_name && (
                                                    <a href={`http://localhost:8000/lab/download/${r.id}`}
                                                        className="px-3 py-1.5 text-xs font-medium rounded-lg bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 hover:bg-sky-100 border border-sky-200 dark:border-sky-700 transition-colors">
                                                        ⬇ {r.file_name}
                                                    </a>
                                                )}
                                            </div>
                                            {r.test_results && Object.keys(r.test_results).length > 0 && (
                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                                    {Object.entries(r.test_results).map(([k, v]) => (
                                                        <div key={k} className="bg-slate-50 dark:bg-slate-700/40 rounded-lg px-3 py-2">
                                                            <p className="text-xs text-slate-400">{k}</p>
                                                            <p className="text-slate-800 dark:text-slate-100 font-semibold text-sm">{v}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            {r.remarks && <p className="text-slate-500 text-sm mt-2 italic">💬 {r.remarks}</p>}
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
