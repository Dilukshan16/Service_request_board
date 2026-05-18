'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import Navbar from '@/components/Navbar';
import StatusBadge from '@/components/StatusBadge';
import CategoryBadge from '@/components/CategoryBadge';

const STATUSES = ['Open', 'In Progress', 'Closed'];

function formatDateTime(iso) {
  return new Date(iso).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function JobDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    api
      .getJob(id)
      .then((data) => {
        setJob(data.data);
        setNewStatus(data.data.status);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleStatusUpdate = async () => {
    if (newStatus === job.status) return;
    setStatusLoading(true);
    setStatusMsg('');
    try {
      const data = await api.updateStatus(id, newStatus);
      setJob(data.data);
      setStatusMsg('Status updated successfully.');
      setTimeout(() => setStatusMsg(''), 3000);
    } catch (err) {
      setStatusMsg(`Error: ${err.message}`);
    } finally {
      setStatusLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.deleteJob(id);
      router.push('/');
    } catch (err) {
      setError(err.message);
      setDeleting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <Link href="/" className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1 mb-6">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to board
        </Link>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400">
            <svg className="animate-spin w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Loading job…
          </div>
        ) : error ? (
          <div className="card p-6 border-red-200 bg-red-50 text-red-700 text-sm">
            <strong>Error:</strong> {error}
          </div>
        ) : job ? (
          <div className="flex flex-col gap-5">
            {/* Header card */}
            <div className="card p-6">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <CategoryBadge category={job.category} />
                <StatusBadge status={job.status} />
              </div>
              <h1 className="font-display text-2xl sm:text-3xl text-slate-900 leading-snug">
                {job.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500">
                {job.location && (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
                    </svg>
                    {job.location}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5"/>
                  </svg>
                  Posted {formatDateTime(job.createdAt)}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="card p-6">
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Description
              </h2>
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap text-sm">
                {job.description}
              </p>
            </div>

            {/* Contact */}
            {(job.contactName || job.contactEmail) && (
              <div className="card p-6">
                <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Contact
                </h2>
                <div className="flex flex-col gap-2 text-sm">
                  {job.contactName && (
                    <span className="flex items-center gap-2 text-slate-700">
                      <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
                      </svg>
                      {job.contactName}
                    </span>
                  )}
                  {job.contactEmail && (
                    <a
                      href={`mailto:${job.contactEmail}`}
                      className="flex items-center gap-2 text-sky-600 hover:underline"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/>
                      </svg>
                      {job.contactEmail}
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Update status */}
            <div className="card p-6">
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Update Status
              </h2>
              <div className="flex flex-wrap gap-3 items-center">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="input-field w-44"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <button
                  onClick={handleStatusUpdate}
                  disabled={statusLoading || newStatus === job.status}
                  className="btn-primary disabled:opacity-50"
                >
                  {statusLoading ? 'Saving…' : 'Update'}
                </button>
              </div>
              {statusMsg && (
                <p className={`text-xs mt-2 ${statusMsg.startsWith('Error') ? 'text-red-600' : 'text-emerald-600'}`}>
                  {statusMsg}
                </p>
              )}
            </div>

            {/* Danger zone */}
            <div className="card p-6 border-red-100">
              <h2 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-3">
                Danger Zone
              </h2>
              {!confirmDelete ? (
                <button onClick={() => setConfirmDelete(true)} className="btn-danger">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
                  </svg>
                  Delete Job
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <p className="text-sm text-slate-600">Are you sure? This cannot be undone.</p>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="btn-danger disabled:opacity-60"
                  >
                    {deleting ? 'Deleting…' : 'Yes, delete'}
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </main>
    </>
  );
}
