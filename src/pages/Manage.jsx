import { useEffect, useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

const common = [['firstname', 'First name'], ['lastname', 'Last name'], ['email', 'Email', 'email']];
const definitions = {
  projects: { label: 'Projects', fields: [['title', 'Title'], ...common, ['completion', 'Completion date', 'date'], ['description', 'Description', 'textarea'], ['url', 'Project URL', 'url', true], ['image', 'Image path or URL', 'text', true], ['role', 'Project role', 'text', true], ['year', 'Display year', 'text', true]] },
  qualifications: { label: 'Education', fields: [['title', 'Qualification title'], ...common, ['completion', 'Completion date', 'date', true], ['description', 'Description', 'textarea']] },
  contacts: { label: 'Contacts', fields: [...common, ['phone', 'Phone', 'tel', true], ['message', 'Message', 'textarea']] },
};
const blank = resource => Object.fromEntries(definitions[resource].fields.map(([name]) => [name, '']));
export default function Manage() {
  const { user, loading } = useAuth();
  const [resource, setResource] = useState('projects');
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState(null);
  const [editing, setEditing] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [reload, setReload] = useState(0);
  const formRef = useRef(null);
  useEffect(() => {
    if (!user) return;
    let active = true; setFetching(true); setError(''); setRecords([]);
    api(`/${resource}`).then(data => { if (active) setRecords(data); }).catch(err => { if (active) setError(err.message); }).finally(() => { if (active) setFetching(false); });
    return () => { active = false; };
  }, [resource, user, reload]);
  useEffect(() => { if (form) formRef.current?.querySelector('input')?.focus(); }, [editing, !!form]);
  if (loading) return <main className="page-shell page-content">Checking your session…</main>;
  if (!user) return <Navigate to="/signin" replace />;
  const admin = user.role === 'admin';
  const definition = definitions[resource];
  function select(next) { setResource(next); setForm(null); setEditing(null); setPendingDelete(null); setMessage(''); setError(''); }
  function edit(record) {
    setEditing(record._id); setPendingDelete(null); setMessage(''); setError('');
    setForm(Object.fromEntries(definition.fields.map(([key, , type]) => [key, type === 'date' ? record[key]?.slice(0, 10) || '' : record[key] || ''])));
  }
  async function save(event) {
    event.preventDefault(); setBusy(true); setError(''); setMessage('');
    try {
      const body = { ...form };
      if (resource === 'qualifications' && !body.completion) body.completion = null;
      const record = await api(`/${resource}${editing ? `/${editing}` : ''}`, { method: editing ? 'PUT' : 'POST', body: JSON.stringify(body) });
      setRecords(editing ? records.map(item => item._id === record._id ? record : item) : [record, ...records]);
      setMessage(editing ? 'Record updated successfully.' : 'Record created successfully.'); setForm(null); setEditing(null);
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  }
  async function remove(id) {
    setBusy(true); setError(''); setMessage('');
    try { await api(`/${resource}/${id}`, { method: 'DELETE' }); setRecords(records.filter(item => item._id !== id)); setPendingDelete(null); setMessage('Record deleted successfully.'); }
    catch (err) { setError(err.message); } finally { setBusy(false); }
  }
  return <main className="page-shell page-content manage-page">
    <div className="page-heading"><p className="eyebrow">{admin ? 'Admin workspace' : 'Your account'}</p><h1>{admin ? 'Manage portfolio' : 'Portfolio records'}</h1><p>{user.name} · {user.email} <span className="role-badge">{admin ? 'Admin' : 'User'}</span></p><p>{admin ? 'Create, read, update and delete portfolio records.' : 'Your account has read-only access to portfolio records.'}</p></div>
    <div className="manage-toolbar"><div className="resource-tabs" role="group" aria-label="Record type">{Object.entries(definitions).map(([key, value]) => <button key={key} className={`button ${key === resource ? 'primary' : 'secondary'}`} aria-pressed={key === resource} disabled={busy} onClick={() => select(key)}>{value.label}</button>)}</div>
    {admin && <button className="button primary" disabled={busy} onClick={() => { setForm(blank(resource)); setEditing(null); setPendingDelete(null); setMessage(''); setError(''); }}>Add {resource === 'qualifications' ? 'education' : resource.slice(0, -1)}</button>}</div>
    {message && <p role="status" className="form-status success">{message}</p>}
    {error && <div role="alert"><p className="form-status error">{error}</p>{!form && <button className="button secondary" onClick={() => setReload(reload + 1)}>Try again</button>}</div>}
    {admin && form && <form ref={formRef} className="contact-form record-form" onSubmit={save}><h2>{editing ? 'Edit' : 'Add'} {resource === 'qualifications' ? 'education' : resource.slice(0, -1)}</h2><div className="form-row record-fields">{definition.fields.map(([name, label, type = 'text', optional]) => <label key={name} className={type === 'textarea' ? 'wide-field' : ''}>{label}{optional ? ' (optional)' : ' *'}{type === 'textarea' ? <textarea rows={4} maxLength={5000} required={!optional} value={form[name]} onChange={e => setForm({ ...form, [name]: e.target.value })} /> : <input name={name} type={type} required={!optional} value={form[name]} onChange={e => setForm({ ...form, [name]: e.target.value })} />}</label>)}</div><div className="record-actions"><button className="button primary" disabled={busy}>{busy ? 'Saving…' : editing ? 'Save changes' : 'Create record'}</button><button type="button" className="button secondary" disabled={busy} onClick={() => { setForm(null); setEditing(null); setError(''); }}>Cancel</button></div></form>}
    <section className="record-list" aria-label={`${definition.label} records`} aria-busy={fetching}>
      {fetching ? <p role="status">Loading records…</p> : !records.length && !error ? <p>No records yet.</p> : records.map(record => <article className="record-card" key={record._id}><div><h2>{record.title || `${record.firstname} ${record.lastname}`}</h2><p className="record-description">{record.description || record.message}</p><p className="record-meta">{record.firstname} {record.lastname} · {record.email}{record.phone && ` · ${record.phone}`}{record.completion && ` · ${record.completion.slice(0, 10)}`}</p></div>
        {admin && <div className="record-actions"><button className="button secondary" disabled={busy} onClick={() => edit(record)}>Edit</button><button className="button danger" disabled={busy} onClick={() => { setPendingDelete(record._id); setForm(null); }}>Delete</button></div>}
        {admin && pendingDelete === record._id && <div className="delete-confirm" role="alert"><p>Delete this record permanently?</p><div className="record-actions"><button className="button danger" disabled={busy} onClick={() => remove(record._id)}>Confirm delete</button><button className="button secondary" disabled={busy} onClick={() => setPendingDelete(null)}>Keep record</button></div></div>}
      </article>)}
    </section>
  </main>;
}
