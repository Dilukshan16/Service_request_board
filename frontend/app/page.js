'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import Navbar from '@/components/Navbar';
import StatusBadge from '@/components/StatusBadge';
import CategoryBadge, { CATEGORIES } from '@/components/CategoryBadge';

const STATUSES = ['Open', 'In Progress', 'Closed'];

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function HomePage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getJobs({ category, status, search });
      setJobs(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [category, status, search]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput.trim());
  };

  const clearFilters = () => {
    setCategory('');
    setStatus('');
    setSearch('');
    setSearchInput('');
  };

  const hasFilters = category || status || search;

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Hero */}
        <div className="mb-8">
          <h1 className="font-display text-3xl sm:text-4xl text-slate-900 mb-2">
            Service Requests
          </h1>
          <p className="text-slate-500 text-sm">
            Browse open jobs or post a new service request for tradespeople in your area.
          </p>
        </div>

        {/* Filters */}
        <div className="card p-4 mb-6">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search jobs…"
                className="input-field pl-9"
              />
            </div>

            {/* Category */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-field sm:w-44"
            >
              <option value="">All categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Status */}
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="input-field sm:w-40"
            >
              <option value="">All statuses</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <button type="submit" className="btn-primary">Search</button>
          </form>

          {hasFilters && (
            <div className="mt-3 flex items-center gap-2 text-sm">
              <span className="text-slate-500">Active filters:</span>
              {category && <span className="bg-sky-100 text-sky-700 px-2 py-0.5 rounded-md text-xs font-medium">{category}</span>}
              {status && <span className="bg-sky-100 text-sky-700 px-2 py-0.5 rounded-md text-xs font-medium">{status}</span>}
              {search && <span className="bg-sky-100 text-sky-700 px-2 py-0.5 rounded-md text-xs font-medium">"{search}"</span>}
              <button onClick={clearFilters} className="text-slate-400 hover:text-slate-700 text-xs underline ml-1">
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400">
            <svg className="animate-spin w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Loading jobs…
          </div>
        ) : error ? (
          <div className="card p-6 border-red-200 bg-red-50 text-red-700 text-sm">
            <strong>Error:</strong> {error}. Make sure the backend is running.
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-slate-500 text-sm">No jobs found matching your filters.</p>
            {hasFilters && (
              <button onClick={clearFilters} className="mt-3 text-sky-600 text-sm hover:underline">
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-500 mb-4">
              {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'} found
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {jobs.map((job) => (
                <Link
                  key={job._id}
                  href={`/jobs/${job._id}`}
                  className="card p-5 flex flex-col gap-3 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <CategoryBadge category={job.category} />
                    <StatusBadge status={job.status} />
                  </div>

                  <div>
                    <h2 className="font-semibold text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-2 leading-snug">
                      {job.title}
                    </h2>
                    <p className="text-slate-500 text-sm mt-1.5 line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>
                  </div>

                  <div className="mt-auto flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      {job.location || 'Location TBC'}
                    </span>
                    <span>{formatDate(job.createdAt)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </main>
    </>
  );
}
