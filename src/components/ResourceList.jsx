import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
export default function ResourceList({ resource }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true; setLoading(true); setError('');
    api(`/${resource}`).then(data => { if (active) setItems(data); }).catch(err => { if (active) setError(err.message); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [resource, attempt]);
  if (loading) return <p role="status">Loading {resource}…</p>;
  if (error) return <div role="alert"><p className="form-status error">{error}</p><button className="button secondary" onClick={() => setAttempt(attempt + 1)}>Try again</button></div>;
  return <>{user?.role === 'admin' && <p><Link className="button secondary" to="/manage">Manage portfolio</Link></p>}
    {!items.length && <p>No {resource} have been added yet.</p>}
    <section className={resource === 'projects' ? 'project-grid' : 'education-list'}>{items.map((item, index) => <article className="project-card" key={item._id}>
      {resource === 'projects' && item.image && <div className="project-image"><img src={item.image} alt={`${item.title} website screenshot`} /></div>}
      <div className="project-body"><div className="project-meta"><span>{String(index + 1).padStart(2, '0')}</span><span>{item.year || (item.completion ? new Date(item.completion).toLocaleDateString('en-CA', { timeZone: 'UTC', year: 'numeric', month: 'long' }) : 'Professional certificate')}</span></div>
        <h2>{item.title}</h2>{item.role && <p className="project-role">{item.role}</p>}<p className="record-description">{item.description}</p>
        {item.url && <a className="project-link" href={item.url} target="_blank" rel="noreferrer">Visit project ↗</a>}
      </div></article>)}</section></>;
}
