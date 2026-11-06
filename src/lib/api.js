const base = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
export async function api(path, options = {}) {
  let response;
  try {
    response = await fetch(`${base}/api${path}`, { credentials: 'include', ...options, headers: { 'Content-Type': 'application/json', ...options.headers } });
  } catch { throw new Error('Cannot reach the API. Check that the backend is running.'); }
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(result.message || 'The request could not be completed.');
    error.status = response.status;
    if (response.status === 401) window.dispatchEvent(new Event('session-expired'));
    throw error;
  }
  return result;
}
