'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import Navbar from '@/components/Navbar';
import { CATEGORIES } from '@/components/CategoryBadge';

const INITIAL = {
  title: '',
  description: '',
  category: '',
  location: '',
  contactName: '',
  contactEmail: '',
};

function validate(fields) {
  const errors = {};
  if (!fields.title.trim()) errors.title = 'Title is required';
  if (!fields.description.trim()) errors.description = 'Description is required';
  if (fields.contactEmail && !/^\S+@\S+\.\S+$/.test(fields.contactEmail)) {
    errors.contactEmail = 'Please enter a valid email address';
  }
  return errors;
}

export default function NewJobPage() {
  const router = useRouter();
  const [fields, setFields] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const set = (k) => (e) => setFields((prev) => ({ ...prev, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(fields);
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSubmitting(true);
    setServerError('');
    try {
      const data = await api.createJob(fields);
      router.push(`/jobs/${data.data._id}`);
    } catch (err) {
      setServerError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <Link href="/" className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1 mb-4">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to board
          </Link>
          <h1 className="font-display text-3xl text-slate-900">Post a Service Request</h1>
          <p className="text-slate-500 text-sm mt-1">
            Describe the job and tradespeople in your area can reach out.
          </p>
        </div>

        {serverError && (
          <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="card p-6 flex flex-col gap-5">
          {/* Title */}
          <div>
            <label className="label" htmlFor="title">
              Job Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={fields.title}
              onChange={set('title')}
              placeholder="e.g. Need a plumber for a leaking kitchen tap"
              className={`input-field ${errors.title ? 'border-red-400 focus:ring-red-400' : ''}`}
              maxLength={120}
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="label" htmlFor="description">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              rows={4}
              value={fields.description}
              onChange={set('description')}
              placeholder="Describe the problem, what needs doing, and any relevant details…"
              className={`input-field resize-none ${errors.description ? 'border-red-400 focus:ring-red-400' : ''}`}
              maxLength={1000}
            />
            <div className="flex justify-between">
              {errors.description ? (
                <p className="text-red-500 text-xs mt-1">{errors.description}</p>
              ) : <span />}
              <p className="text-xs text-slate-400 mt-1">{fields.description.length}/1000</p>
            </div>
          </div>

          {/* Category + Location */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="category">Category</label>
              <select
                id="category"
                value={fields.category}
                onChange={set('category')}
                className="input-field"
              >
                <option value="">Select category…</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="location">Location</label>
              <input
                id="location"
                type="text"
                value={fields.location}
                onChange={set('location')}
                placeholder="e.g. Glasgow"
                className="input-field"
              />
            </div>
          </div>

          {/* Contact */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="contactName">Your Name</label>
              <input
                id="contactName"
                type="text"
                value={fields.contactName}
                onChange={set('contactName')}
                placeholder="John Smith"
                className="input-field"
              />
            </div>
            <div>
              <label className="label" htmlFor="contactEmail">Contact Email</label>
              <input
                id="contactEmail"
                type="email"
                value={fields.contactEmail}
                onChange={set('contactEmail')}
                placeholder="you@example.com"
                className={`input-field ${errors.contactEmail ? 'border-red-400 focus:ring-red-400' : ''}`}
              />
              {errors.contactEmail && (
                <p className="text-red-500 text-xs mt-1">{errors.contactEmail}</p>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-2 border-t border-slate-100">
            <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60">
              {submitting ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Posting…
                </>
              ) : 'Post Job Request'}
            </button>
            <Link href="/" className="btn-secondary">Cancel</Link>
          </div>
        </form>
      </main>
    </>
  );
}
