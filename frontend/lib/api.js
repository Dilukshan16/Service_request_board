const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    const message =
      data?.error ||
      (data?.details ? data.details.join(', ') : null) ||
      `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  return data;
}

export const api = {
  getJobs: (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v))
    ).toString();
    return apiFetch(`/api/jobs${qs ? `?${qs}` : ''}`);
  },

  getJob: (id) => apiFetch(`/api/jobs/${id}`),

  createJob: (body) =>
    apiFetch('/api/jobs', { method: 'POST', body: JSON.stringify(body) }),

  updateStatus: (id, status) =>
    apiFetch(`/api/jobs/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  deleteJob: (id) => apiFetch(`/api/jobs/${id}`, { method: 'DELETE' }),
};
